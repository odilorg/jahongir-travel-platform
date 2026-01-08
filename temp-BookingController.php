<?php

namespace App\Http\Controllers\Partials;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\Customer;
use App\Models\Booking;
use App\Models\TourInquiry;
use App\Mail\BookingConfirmation;
use App\Mail\BookingAdminNotification;
use App\Mail\InquiryConfirmation;
use App\Mail\InquiryAdminNotification;
use App\Services\TelegramNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Show booking form partial
     * Returns: Booking form HTML with tour details
     */
    public function form(string $tourSlug)
    {
        $tour = Tour::where('slug', $tourSlug)
            ->where('is_active', true)
            ->with('activeExtras')
            ->firstOrFail();

        return view('partials.bookings.form', compact('tour'));
    }

    /**
     * Store booking or inquiry
     * Returns: Confirmation HTML or error HTML
     *
     * Routes to handleBooking() or handleInquiry() based on action_type
     */
    public function store(Request $request)
    {
        // Determine action type
        $actionType = $request->input('action_type', 'booking'); // 'booking' or 'inquiry'

        if ($actionType === 'inquiry') {
            return $this->handleInquiry($request);
        }

        return $this->handleBooking($request);
    }

    /**
     * Handle booking creation
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleBooking(Request $request)
    {
        // Debug: Log what we're actually receiving
        Log::info('Booking Request Received', [
            'all_data' => $request->all(),
            'has_tour_date' => $request->has('tour-date'),
            'has_tour_guests' => $request->has('tour-guests'),
            'tour_date_value' => $request->input('tour-date'),
            'tour_guests_value' => $request->input('tour-guests'),
        ]);

        // Validation - JS is sending start_date and number_of_guests (not tour-date/tour-guests)
        $validator = Validator::make($request->all(), [
            'tour_id' => 'required|exists:tours,id',
            'departure_id' => 'required|exists:tour_departures,id',
            'start_date' => 'required|date|after_or_equal:today',
            'number_of_guests' => 'required|integer|min:1|max:50',
            'tour_type' => 'nullable|in:private,group',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'customer_country' => 'nullable|string|max:100',
            'special_requests' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            Log::error('Booking Validation Failed', [
                'errors' => $validator->errors()->toArray(),
                'request_data' => $request->all(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Get tour
            $tour = Tour::findOrFail($request->tour_id);

            // Find or create customer
            $customer = Customer::firstOrCreate(
                ['email' => $request->customer_email],
                [
                    'name' => $request->customer_name,
                    'phone' => $request->customer_phone,
                    'country' => $request->customer_country,
                    'address' => '', // Default empty address
                ]
            );

            // Calculate pricing based on tour type selection
            $numberOfGuests = $request->number_of_guests;
            $selectedTourType = $request->tour_type ?? 'private'; // Default to private

            // Determine pricing based on selected tour type
            if ($selectedTourType === 'group' && $tour->group_tour_price_per_person) {
                // Use fixed group tour pricing
                $pricePerPerson = $tour->group_tour_price_per_person;
                $totalAmount = $pricePerPerson * $numberOfGuests;
            } else {
                // Use tiered pricing for private tours
                $pricingTier = $tour->getPricingTierForGuests($numberOfGuests);

                if ($pricingTier) {
                    // Use tiered pricing
                    $totalAmount = $pricingTier->price_total;
                    $pricePerPerson = $pricingTier->price_per_person;
                } else {
                    // Fallback to base price
                    $pricePerPerson = $tour->price_per_person ?? 0;
                    $totalAmount = $pricePerPerson * $numberOfGuests;
                }
            }

            // Debug logging
            Log::info('Booking Creation Debug', [
                'tour_id' => $tour->id,
                'has_tiered_pricing' => $pricingTier ? true : false,
                'tier_id' => $pricingTier?->id,
                'price_per_person' => $pricePerPerson,
                'number_of_guests' => $numberOfGuests,
                'calculated_total' => $totalAmount,
                'payment_method_from_request' => $request->payment_method,
                'all_request_data' => $request->all(),
            ]);

            // Create booking
            $booking = Booking::create([
                'tour_id' => $tour->id,
                'departure_id' => $request->departure_id,
                'customer_id' => $customer->id,
                'selected_tour_type' => $selectedTourType,
                'start_date' => $request->start_date,
                'pax_total' => $numberOfGuests,
                'total_price' => $totalAmount,
                'special_requests' => $request->special_requests,
                'status' => 'pending_payment',
                'payment_method' => $request->payment_method ?? 'request',
                'payment_status' => 'pending',
            ]);

            Log::info('Booking Created', [
                'booking_id' => $booking->id,
                'reference' => $booking->reference,
                'total_price_saved' => $booking->total_price,
                'payment_method_saved' => $booking->payment_method,
            ]);

            DB::commit();

            // Send emails (don't fail if email fails)
            try {
                // Send confirmation to customer
                Mail::to($customer->email)
                    ->send(new BookingConfirmation($booking, $customer));

                // Send notification to admin
                $adminEmail = config('mail.admin_email', 'admin@jahongir-hotels.uz');
                Mail::to($adminEmail)
                    ->send(new BookingAdminNotification($booking, $customer));

            } catch (\Exception $e) {
                Log::error('Failed to send booking emails: ' . $e->getMessage(), [
                    'booking_id' => $booking->id,
                    'customer_email' => $customer->email,
                ]);
            }

            // Send Telegram notification
            try {
                $telegramService = new TelegramNotificationService();
                $telegramService->sendBookingNotification($booking);
            } catch (\Exception $e) {
                Log::error('Failed to send Telegram notification: ' . $e->getMessage());
            }

            // Refresh to get latest data with relationships
            $booking->load(['tour', 'customer']);

            return response()->json([
                'success' => true,
                'message' => 'Booking request submitted successfully!',
                'booking' => [
                    'id' => $booking->id,
                    'reference' => $booking->reference,
                    'tour' => [
                        'title' => $booking->tour->title,
                    ],
                    'start_date' => $booking->start_date->format('Y-m-d'),
                    'pax_total' => $booking->pax_total,
                    'total_price' => number_format($booking->total_price, 2, '.', ''),
                    'customer' => [
                        'email' => $booking->customer->email,
                        'name' => $booking->customer->name,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Booking creation failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your booking. Please try again.'
            ], 500);
        }
    }

    /**
     * Handle inquiry creation (both simple and inquiry mode)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleInquiry(Request $request)
    {
        $isInquiryMode = $request->boolean('is_inquiry_mode', false);

        // Honeypot check - if filled, it's a bot
        if (!empty($request->input('website_hp'))) {
            Log::warning('Inquiry honeypot triggered', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            // Return fake success to not alert the bot
            return response()->json([
                'success' => true,
                'message' => 'Thank you for your inquiry!',
            ]);
        }

        // Build validation rules based on inquiry mode
        $rules = [
            'tour_id' => 'required|exists:tours,id',
            'customer_name' => 'required|string|max:255',
        ];

        if ($isInquiryMode) {
            // Inquiry mode: guests required, phone OR email required
            $rules['estimated_guests'] = 'required|integer|min:1|max:50';
            $rules['preferred_date'] = 'nullable|date|after_or_equal:today';
            $rules['preferred_language'] = 'nullable|string|in:en,ru,uz';
            $rules['preferred_contact_method'] = 'nullable|string|in:email,phone,whatsapp';
            $rules['message'] = 'nullable|string|max:1000';

            // Phone OR email required (at least one)
            $rules['customer_email'] = 'required_without:customer_phone|nullable|email|max:255';
            $rules['customer_phone'] = 'required_without:customer_email|nullable|string|max:50';
        } else {
            // Simple inquiry: email and message required
            $rules['customer_email'] = 'required|email|max:255';
            $rules['message'] = 'required|string|max:1000';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Get tour
            $tour = Tour::findOrFail($request->tour_id);

            // Prepare inquiry data
            $inquiryData = [
                'tour_id' => $tour->id,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'message' => $request->message ?? '',
                'status' => 'new',
                'is_inquiry_mode' => $isInquiryMode,
                'source_url' => $request->header('Referer'),
                'user_agent' => $request->userAgent(),
                'ip_address' => $request->ip(),
            ];

            // Add inquiry mode specific fields
            if ($isInquiryMode) {
                $inquiryData['estimated_guests'] = $request->estimated_guests;
                $inquiryData['preferred_date'] = $request->preferred_date;
                $inquiryData['preferred_language'] = $request->preferred_language;
                $inquiryData['preferred_contact_method'] = $request->preferred_contact_method;
            }

            // Create inquiry
            $inquiry = TourInquiry::create($inquiryData);

            DB::commit();

            // Send emails (don't fail if email fails)
            try {
                // Send confirmation to customer (only if email provided)
                if ($inquiry->customer_email) {
                    Mail::to($inquiry->customer_email)
                        ->send(new InquiryConfirmation($inquiry, $tour));
                }

                // Send notification to admin
                $adminEmail = config('mail.admin_email', 'admin@jahongir-hotels.uz');
                Mail::to($adminEmail)
                    ->send(new InquiryAdminNotification($inquiry, $tour));

            } catch (\Exception $e) {
                Log::error('Failed to send inquiry emails: ' . $e->getMessage(), [
                    'inquiry_id' => $inquiry->id,
                    'customer_email' => $inquiry->customer_email,
                ]);
            }

            // Send Telegram notification
            try {
                $telegramService = new TelegramNotificationService();
                $telegramService->sendInquiryNotification($inquiry, $tour);
            } catch (\Exception $e) {
                Log::error('Failed to send Telegram notification: ' . $e->getMessage());
            }

            // Return appropriate success message
            $successMessage = $isInquiryMode
                ? 'Thank you! We will contact you within 24 hours with pricing details.'
                : 'Question submitted successfully! We will respond within 24 hours.';

            return response()->json([
                'success' => true,
                'message' => $successMessage,
                'inquiry' => [
                    'reference' => $inquiry->reference,
                    'customer_name' => $inquiry->customer_name,
                    'customer_email' => $inquiry->customer_email,
                    'tour' => [
                        'title' => $tour->title,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Inquiry creation failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting your inquiry. Please try again.'
            ], 500);
        }
    }

    /**
     * Show booking confirmation page
     *
     * @param string $reference
     * @return \Illuminate\View\View
     */
    public function confirmation(string $reference)
    {
        // Find booking by reference with relationships
        $booking = Booking::where('reference', $reference)
            ->with(['tour', 'customer'])
            ->firstOrFail();

        return view('booking-confirmation', compact('booking'));
    }
}

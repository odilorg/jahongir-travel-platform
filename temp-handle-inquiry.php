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

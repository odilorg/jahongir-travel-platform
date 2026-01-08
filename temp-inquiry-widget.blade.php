{{--
    Inquiry Mode Widget
    Displayed when show_price = false on a tour
    Mobile-first, accessible design
--}}

<div class="inquiry-widget" id="inquiry-widget" data-tour-id="{{ $tour->id }}">
    {{-- Success State (hidden initially) --}}
    <div id="inquiry-success" class="inquiry-success" style="display: none;">
        <div class="inquiry-success__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9 12l2 2 4-4"/>
            </svg>
        </div>
        <h3 class="inquiry-success__title">Thank you!</h3>
        <p class="inquiry-success__message">We received your request. We'll contact you shortly.</p>
        <div class="inquiry-success__summary" id="inquiry-summary"></div>
        <button type="button" class="inquiry-success__reset" onclick="resetInquiryForm()">
            Send another request
        </button>
    </div>

    {{-- Inquiry Form --}}
    <div id="inquiry-form-container">
        {{-- Header --}}
        <div class="inquiry-widget__header">
            <div class="inquiry-widget__badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
                </svg>
                <span>Price on request</span>
            </div>
            <h3 class="inquiry-widget__title">Get a quote for this tour</h3>
            <p class="inquiry-widget__subtitle">Tell us your date and group size — we'll reply quickly with price and details.</p>
        </div>

        <form id="inquiry-form" class="inquiry-form" novalidate>
            @csrf
            <input type="hidden" name="tour_id" value="{{ $tour->id }}">
            <input type="hidden" name="action_type" value="inquiry">
            <input type="hidden" name="is_inquiry_mode" value="1">
            <input type="hidden" name="source_url" value="">

            {{-- Honeypot (anti-spam) --}}
            <div class="inquiry-form__hp" aria-hidden="true">
                <label for="website_hp">Website</label>
                <input type="text" name="website_hp" id="website_hp" tabindex="-1" autocomplete="off">
            </div>

            {{-- Section: Trip Details --}}
            <fieldset class="inquiry-form__section">
                <legend class="inquiry-form__legend">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Trip Details
                </legend>

                {{-- Desired Date --}}
                <div class="inquiry-form__group">
                    <label for="preferred_date" class="inquiry-form__label">
                        Desired travel date
                        <span class="inquiry-form__optional">(optional)</span>
                    </label>
                    <div class="inquiry-form__date-wrapper">
                        <input
                            type="date"
                            id="preferred_date"
                            name="preferred_date"
                            class="inquiry-form__input inquiry-form__input--date"
                            min="{{ date('Y-m-d') }}"
                            aria-describedby="preferred_date_hint"
                        >
                        <label class="inquiry-form__checkbox-label">
                            <input type="checkbox" id="date_flexible" name="date_flexible" value="1">
                            <span>I'm flexible / Not sure yet</span>
                        </label>
                    </div>
                    <span id="preferred_date_hint" class="inquiry-form__hint">Leave empty if dates are flexible</span>
                </div>

                {{-- Number of Guests --}}
                <div class="inquiry-form__group">
                    <label for="estimated_guests" class="inquiry-form__label">
                        Number of guests
                        <span class="inquiry-form__required">*</span>
                    </label>
                    <select
                        id="estimated_guests"
                        name="estimated_guests"
                        class="inquiry-form__input inquiry-form__input--select"
                        required
                        aria-required="true"
                        aria-describedby="estimated_guests_error"
                    >
                        <option value="">Select...</option>
                        @for($i = 1; $i <= 20; $i++)
                            <option value="{{ $i }}">{{ $i }} {{ $i === 1 ? 'guest' : 'guests' }}</option>
                        @endfor
                        <option value="21">20+ guests (group)</option>
                    </select>
                    <span id="estimated_guests_error" class="inquiry-form__error" role="alert"></span>
                </div>

                {{-- Preferred Language --}}
                <div class="inquiry-form__group">
                    <label for="preferred_language" class="inquiry-form__label">
                        Preferred language
                        <span class="inquiry-form__optional">(optional)</span>
                    </label>
                    <select
                        id="preferred_language"
                        name="preferred_language"
                        class="inquiry-form__input inquiry-form__input--select"
                    >
                        <option value="">Select language...</option>
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                        <option value="uz">O'zbek</option>
                        <option value="fr">Français</option>
                    </select>
                </div>
            </fieldset>

            {{-- Section: Contact Information --}}
            <fieldset class="inquiry-form__section">
                <legend class="inquiry-form__legend">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Contact Information
                </legend>

                {{-- Full Name --}}
                <div class="inquiry-form__group">
                    <label for="customer_name" class="inquiry-form__label">
                        Full name
                        <span class="inquiry-form__required">*</span>
                    </label>
                    <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        class="inquiry-form__input"
                        placeholder="John Doe"
                        required
                        aria-required="true"
                        aria-describedby="customer_name_error"
                        autocomplete="name"
                    >
                    <span id="customer_name_error" class="inquiry-form__error" role="alert"></span>
                </div>

                {{-- Phone/WhatsApp --}}
                <div class="inquiry-form__group">
                    <label for="customer_phone" class="inquiry-form__label">
                        Phone / WhatsApp
                        <span class="inquiry-form__required">*</span>
                    </label>
                    <input
                        type="tel"
                        id="customer_phone"
                        name="customer_phone"
                        class="inquiry-form__input"
                        placeholder="+1 234 567 8900"
                        required
                        aria-required="true"
                        aria-describedby="customer_phone_error customer_phone_hint"
                        autocomplete="tel"
                    >
                    <span id="customer_phone_hint" class="inquiry-form__hint">Include country code for WhatsApp</span>
                    <span id="customer_phone_error" class="inquiry-form__error" role="alert"></span>
                </div>

                {{-- Email --}}
                <div class="inquiry-form__group">
                    <label for="customer_email" class="inquiry-form__label">
                        Email
                        <span class="inquiry-form__optional">(recommended)</span>
                    </label>
                    <input
                        type="email"
                        id="customer_email"
                        name="customer_email"
                        class="inquiry-form__input"
                        placeholder="john@example.com"
                        aria-describedby="customer_email_error"
                        autocomplete="email"
                    >
                    <span id="customer_email_error" class="inquiry-form__error" role="alert"></span>
                </div>

                {{-- Preferred Contact Method --}}
                <div class="inquiry-form__group">
                    <label class="inquiry-form__label">
                        Preferred contact method
                        <span class="inquiry-form__optional">(optional)</span>
                    </label>
                    <div class="inquiry-form__radio-group">
                        <label class="inquiry-form__radio">
                            <input type="radio" name="preferred_contact_method" value="whatsapp">
                            <span class="inquiry-form__radio-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                WhatsApp
                            </span>
                        </label>
                        <label class="inquiry-form__radio">
                            <input type="radio" name="preferred_contact_method" value="phone">
                            <span class="inquiry-form__radio-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                Phone Call
                            </span>
                        </label>
                        <label class="inquiry-form__radio">
                            <input type="radio" name="preferred_contact_method" value="email">
                            <span class="inquiry-form__radio-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                Email
                            </span>
                        </label>
                    </div>
                </div>
            </fieldset>

            {{-- Section: Message --}}
            <fieldset class="inquiry-form__section">
                <legend class="inquiry-form__legend">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Message
                </legend>

                <div class="inquiry-form__group">
                    <label for="message" class="inquiry-form__label">
                        Additional notes
                        <span class="inquiry-form__optional">(optional)</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        class="inquiry-form__input inquiry-form__input--textarea"
                        rows="3"
                        placeholder="Any notes? Hotel pickup, dietary needs, custom route, etc."
                        aria-describedby="message_hint"
                    ></textarea>
                    <span id="message_hint" class="inquiry-form__hint">Tell us about any special requirements</span>
                </div>
            </fieldset>

            {{-- Submit Button --}}
            <div class="inquiry-form__actions">
                <button type="submit" class="inquiry-form__submit" id="inquiry-submit-btn">
                    <span class="inquiry-form__submit-text">Request a quote</span>
                    <span class="inquiry-form__submit-loading" style="display: none;">
                        <svg class="inquiry-form__spinner" width="20" height="20" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 70"/>
                        </svg>
                        Sending...
                    </span>
                </button>
            </div>

            {{-- General Error Message --}}
            <div id="inquiry-error" class="inquiry-form__general-error" role="alert" style="display: none;"></div>
        </form>

        {{-- Alternative CTA --}}
        <div class="inquiry-widget__footer">
            <p>Have a quick question?</p>
            <a href="#message" class="inquiry-widget__ask-link" onclick="focusMessageField(); return false;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Ask a question
            </a>
        </div>
    </div>
</div>

{{-- Inquiry Widget Styles --}}
<style>
/* Inquiry Widget - Mobile First */
.inquiry-widget {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.inquiry-widget__header {
    padding: 24px 20px 16px;
    text-align: center;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
}

.inquiry-widget__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #fef3c7;
    color: #92400e;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 12px;
}

.inquiry-widget__title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px;
    line-height: 1.3;
}

.inquiry-widget__subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
}

/* Form Styles */
.inquiry-form {
    padding: 20px;
}

.inquiry-form__hp {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.inquiry-form__section {
    border: none;
    padding: 0;
    margin: 0 0 24px;
}

.inquiry-form__legend {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
    width: 100%;
}

.inquiry-form__legend svg {
    color: #64748b;
}

.inquiry-form__group {
    margin-bottom: 16px;
}

.inquiry-form__group:last-child {
    margin-bottom: 0;
}

.inquiry-form__label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    margin-bottom: 6px;
}

.inquiry-form__required {
    color: #ef4444;
    margin-left: 2px;
}

.inquiry-form__optional {
    font-weight: 400;
    color: #94a3b8;
    font-size: 12px;
}

.inquiry-form__input {
    width: 100%;
    padding: 12px 14px;
    font-size: 16px; /* Prevent zoom on iOS */
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    background: #ffffff;
    color: #1e293b;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    appearance: none;
}

.inquiry-form__input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.inquiry-form__input--select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 40px;
}

.inquiry-form__input--textarea {
    resize: vertical;
    min-height: 80px;
}

.inquiry-form__input.is-invalid {
    border-color: #ef4444;
}

.inquiry-form__input.is-invalid:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.inquiry-form__date-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.inquiry-form__checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #475569;
    cursor: pointer;
}

.inquiry-form__checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.inquiry-form__hint {
    display: block;
    font-size: 12px;
    color: #94a3b8;
    margin-top: 4px;
}

.inquiry-form__error {
    display: block;
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
    min-height: 16px;
}

/* Radio Group */
.inquiry-form__radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.inquiry-form__radio {
    cursor: pointer;
}

.inquiry-form__radio input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.inquiry-form__radio-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #475569;
    transition: all 0.2s;
}

.inquiry-form__radio input[type="radio"]:checked + .inquiry-form__radio-label {
    background: #eff6ff;
    border-color: #3b82f6;
    color: #1d4ed8;
}

.inquiry-form__radio input[type="radio"]:focus + .inquiry-form__radio-label {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Submit Button */
.inquiry-form__actions {
    margin-top: 24px;
}

.inquiry-form__submit {
    width: 100%;
    padding: 16px 24px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.inquiry-form__submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.inquiry-form__submit:active:not(:disabled) {
    transform: translateY(0);
}

.inquiry-form__submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.inquiry-form__spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.inquiry-form__general-error {
    margin-top: 16px;
    padding: 12px 16px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    font-size: 14px;
}

/* Footer */
.inquiry-widget__footer {
    padding: 16px 20px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    text-align: center;
}

.inquiry-widget__footer p {
    font-size: 13px;
    color: #64748b;
    margin: 0 0 8px;
}

.inquiry-widget__ask-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #3b82f6;
    text-decoration: none;
}

.inquiry-widget__ask-link:hover {
    text-decoration: underline;
}

/* Success State */
.inquiry-success {
    padding: 40px 24px;
    text-align: center;
}

.inquiry-success__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: #dcfce7;
    border-radius: 50%;
    color: #16a34a;
    margin-bottom: 20px;
}

.inquiry-success__title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px;
}

.inquiry-success__message {
    font-size: 15px;
    color: #64748b;
    margin: 0 0 20px;
    line-height: 1.5;
}

.inquiry-success__summary {
    background: #f8fafc;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
    text-align: left;
    font-size: 14px;
    color: #475569;
}

.inquiry-success__summary-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid #e2e8f0;
}

.inquiry-success__summary-item:last-child {
    border-bottom: none;
}

.inquiry-success__summary-label {
    color: #94a3b8;
}

.inquiry-success__summary-value {
    font-weight: 500;
    color: #1e293b;
}

.inquiry-success__reset {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    color: #3b82f6;
    background: transparent;
    border: 1px solid #3b82f6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.inquiry-success__reset:hover {
    background: #eff6ff;
}

/* Desktop Styles */
@media (min-width: 768px) {
    .inquiry-widget__header {
        padding: 28px 24px 20px;
    }

    .inquiry-widget__title {
        font-size: 22px;
    }

    .inquiry-form {
        padding: 24px;
    }

    .inquiry-form__radio-group {
        gap: 12px;
    }

    .inquiry-form__submit {
        width: auto;
        min-width: 200px;
        margin: 0 auto;
        display: flex;
    }
}
</style>

{{-- Inquiry Widget JavaScript --}}
<script>
(function() {
    'use strict';

    const form = document.getElementById('inquiry-form');
    const submitBtn = document.getElementById('inquiry-submit-btn');
    const successDiv = document.getElementById('inquiry-success');
    const formContainer = document.getElementById('inquiry-form-container');
    const errorDiv = document.getElementById('inquiry-error');
    const summaryDiv = document.getElementById('inquiry-summary');

    // Set source URL
    document.querySelector('input[name="source_url"]').value = window.location.href;

    // Form validation
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Validate guests
        const guests = document.getElementById('estimated_guests');
        if (!guests.value) {
            showFieldError('estimated_guests', 'Please select number of guests');
            isValid = false;
        }

        // Validate name
        const name = document.getElementById('customer_name');
        if (!name.value.trim()) {
            showFieldError('customer_name', 'Please enter your name');
            isValid = false;
        }

        // Validate phone
        const phone = document.getElementById('customer_phone');
        if (!phone.value.trim()) {
            showFieldError('customer_phone', 'Please enter your phone number');
            isValid = false;
        } else if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,}$/.test(phone.value.trim())) {
            showFieldError('customer_phone', 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate email if provided
        const email = document.getElementById('customer_email');
        if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            showFieldError('customer_email', 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(fieldId + '_error');
        if (field) field.classList.add('is-invalid');
        if (errorSpan) errorSpan.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll('.inquiry-form__input.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelectorAll('.inquiry-form__error').forEach(el => {
            el.textContent = '';
        });
        errorDiv.style.display = 'none';
    }

    function setLoading(loading) {
        submitBtn.disabled = loading;
        submitBtn.querySelector('.inquiry-form__submit-text').style.display = loading ? 'none' : 'inline';
        submitBtn.querySelector('.inquiry-form__submit-loading').style.display = loading ? 'inline-flex' : 'none';
    }

    function showSuccess(data) {
        // Build summary
        let summaryHtml = '<div class="inquiry-success__summary-item">' +
            '<span class="inquiry-success__summary-label">Reference</span>' +
            '<span class="inquiry-success__summary-value">' + (data.inquiry?.reference || 'N/A') + '</span>' +
            '</div>';

        const guests = document.getElementById('estimated_guests').value;
        const date = document.getElementById('preferred_date').value;

        if (guests) {
            summaryHtml += '<div class="inquiry-success__summary-item">' +
                '<span class="inquiry-success__summary-label">Guests</span>' +
                '<span class="inquiry-success__summary-value">' + guests + '</span>' +
                '</div>';
        }

        if (date) {
            summaryHtml += '<div class="inquiry-success__summary-item">' +
                '<span class="inquiry-success__summary-label">Date</span>' +
                '<span class="inquiry-success__summary-value">' + new Date(date).toLocaleDateString() + '</span>' +
                '</div>';
        }

        summaryDiv.innerHTML = summaryHtml;
        formContainer.style.display = 'none';
        successDiv.style.display = 'block';

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            // Focus first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        setLoading(true);
        clearErrors();

        try {
            const formData = new FormData(form);

            const response = await fetch('/partials/bookings', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || formData.get('_token'),
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showSuccess(data);
            } else {
                // Handle validation errors
                if (data.errors) {
                    Object.keys(data.errors).forEach(field => {
                        const fieldId = field.replace('_', '_');
                        showFieldError(fieldId, data.errors[field][0]);
                    });
                }
                showError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Inquiry submission error:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    });

    // Clear field error on input
    form.querySelectorAll('.inquiry-form__input').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            const errorSpan = document.getElementById(this.id + '_error');
            if (errorSpan) errorSpan.textContent = '';
        });
    });

    // Date flexible checkbox
    const dateFlexible = document.getElementById('date_flexible');
    const dateInput = document.getElementById('preferred_date');
    if (dateFlexible && dateInput) {
        dateFlexible.addEventListener('change', function() {
            dateInput.disabled = this.checked;
            if (this.checked) dateInput.value = '';
        });
    }
})();

// Focus message field (for "Ask a question" link)
function focusMessageField() {
    const messageField = document.getElementById('message');
    if (messageField) {
        messageField.focus();
        messageField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Reset inquiry form (for success state)
function resetInquiryForm() {
    const form = document.getElementById('inquiry-form');
    const successDiv = document.getElementById('inquiry-success');
    const formContainer = document.getElementById('inquiry-form-container');

    form.reset();
    successDiv.style.display = 'none';
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

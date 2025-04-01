/**
 * SMS Service - Twilio implementation
 * This service connects to the Twilio API to send real SMS messages
 */
import twilio from 'twilio';

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SMSMessage {
  to: string;
  message: string;
}

export class SMSService {
  private twilioClient: twilio.Twilio | null = null;
  private twilioPhone: string | null = null;
  private isConfigured: boolean = false;

  constructor() {
    // Initialize Twilio client if environment variables are set
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && phoneNumber) {
      this.twilioClient = twilio(accountSid, authToken);
      this.twilioPhone = phoneNumber;
      this.isConfigured = true;
      console.log('[SMS Service] Twilio client initialized with provided credentials');
    } else {
      console.log('[SMS Service] Warning: Twilio is not configured. SMS will be simulated.');
    }
  }

  /**
   * Send an SMS message to a phone number using Twilio
   * @param to Phone number in international format
   * @param message SMS content
   * @returns Response with success status and optional message ID or error
   */
  async sendSMS(to: string, message: string): Promise<SMSResponse> {
    // Log the SMS for development purposes
    console.log(`[SMS Service] Sending SMS to ${to}: ${message}`);
    
    // Check if Twilio is configured
    if (this.isConfigured && this.twilioClient && this.twilioPhone) {
      try {
        // Make sure phone number has international format (starts with +)
        const formattedNumber = to.startsWith('+') ? to : `+${to}`;
        
        // Send SMS via Twilio
        const twilioMessage = await this.twilioClient.messages.create({
          body: message,
          from: this.twilioPhone,
          to: formattedNumber
        });
        
        console.log(`[SMS Service] SMS sent successfully via Twilio. SID: ${twilioMessage.sid}`);
        
        return {
          success: true,
          messageId: twilioMessage.sid
        };
      } catch (error) {
        console.error('[SMS Service] Twilio error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown Twilio error'
        };
      }
    } else {
      // Fall back to simulation if Twilio is not configured
      console.log('[SMS Service] Simulating SMS (Twilio not configured)');
      
      // Simulate a small delay to mimic network latency (200-500ms)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
      
      // Simulate a very high success rate (98%)
      const isSuccess = Math.random() > 0.02;
      
      if (isSuccess) {
        const messageId = `simulated_msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        return {
          success: true,
          messageId
        };
      } else {
        return {
          success: false,
          error: "Failed to deliver message (simulation)"
        };
      }
    }
  }
  
  /**
   * Formats a student absence notification message
   * @param studentName Full name of the student
   * @param date Date of absence
   * @param time Time period of absence
   * @param subject Subject or class missed
   * @returns Formatted SMS message
   */
  formatAbsenceMessage(studentName: string, date: string, time: string, subject: string): string {
    return `GestiAbsences: Votre enfant ${studentName} a été absent(e) le ${date} de ${time} au cours de ${subject}. Pour toute information, merci de contacter l'établissement.`;
  }
}

// Singleton instance
export const smsService = new SMSService();

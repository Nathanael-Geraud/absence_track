/**
 * SMS Service - Simulated implementation for the MVP
 * In production, this would integrate with a real SMS provider (e.g., Twilio, Vonage, etc.)
 */

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
  /**
   * Send an SMS message to a phone number
   * @param to Phone number in international format
   * @param message SMS content
   * @returns Response with success status and optional message ID or error
   */
  async sendSMS(to: string, message: string): Promise<SMSResponse> {
    // Log the SMS for development purposes
    console.log(`[SMS Service] Sending SMS to ${to}: ${message}`);
    
    // Simulate a small delay to mimic network latency (200-500ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
    
    // Simulate a very high success rate (98%)
    const isSuccess = Math.random() > 0.02;
    
    if (isSuccess) {
      const messageId = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      return {
        success: true,
        messageId
      };
    } else {
      return {
        success: false,
        error: "Failed to deliver message due to network issues"
      };
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

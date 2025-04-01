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
  private twilioSender: string | null = null;
  private isConfigured: boolean = false;
  private useAlphanumericSender: boolean = false; // Désactivé pour les comptes d'essai Twilio
  private isTrial: boolean = false;

  constructor() {
    // Initialize Twilio client if environment variables are set
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    let phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
      
      // Check if using trial account
      if (accountSid.startsWith('AC') && accountSid.length === 34) {
        this.isTrial = true;
        console.log('[SMS Service] Compte d\'essai Twilio détecté.');
        console.log('[SMS Service] REMARQUE: Les comptes d\'essai ne peuvent pas utiliser d\'ID alphanumérique.');
        console.log('[SMS Service] Le numéro de téléphone Twilio sera utilisé comme expéditeur.');
        
        // Forcer l'utilisation du numéro de téléphone pour les comptes d'essai
        this.useAlphanumericSender = false;
        
        console.log('[SMS Service] REMARQUE IMPORTANTE: Si vous utilisez un compte Twilio d\'essai,');
        console.log('[SMS Service] vous devez vérifier les numéros de téléphone des destinataires');
        console.log('[SMS Service] dans votre console Twilio avant de pouvoir leur envoyer des SMS.');
        console.log('[SMS Service] Visitez: https://www.twilio.com/console/phone-numbers/verified');
      } else {
        // Ce n'est pas un compte d'essai, nous pouvons utiliser l'ID alphanumérique
        this.useAlphanumericSender = true;
      }
      
      // Si nous utilisons un ID alphanumérique comme expéditeur et ce n'est pas un compte d'essai
      if (this.useAlphanumericSender && !this.isTrial) {
        this.twilioSender = "GestiAbs"; // Maximum 11 caractères
        console.log(`[SMS Service] Using alphanumeric sender ID: ${this.twilioSender}`);
      } 
      // Sinon, utiliser le numéro de téléphone Twilio (obligatoire pour les comptes d'essai)
      else if (phoneNumber) {
        // Format the Twilio phone number correctly (should be in E.164 format)
        if (phoneNumber.startsWith('0') && phoneNumber.length === 10) {
          // French number starting with 0, convert to +33
          phoneNumber = `+33${phoneNumber.substring(1)}`;
          console.log(`[SMS Service] Formatted Twilio phone number from ${process.env.TWILIO_PHONE_NUMBER} to ${phoneNumber}`);
        } else if (!phoneNumber.startsWith('+')) {
          // Add + if missing
          phoneNumber = `+${phoneNumber}`;
          console.log(`[SMS Service] Added + prefix to Twilio phone number: ${phoneNumber}`);
        }
        
        this.twilioSender = phoneNumber;
        console.log(`[SMS Service] Using Twilio phone number: ${this.twilioSender}`);
      }
      
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
    if (this.isConfigured && this.twilioClient && this.twilioSender) {
      try {
        // Note: Nous supposons que le numéro 'to' est déjà au format international
        // car il est formaté dans sms.ts avant d'être passé ici
        
        // Send SMS via Twilio
        const twilioMessage = await this.twilioClient.messages.create({
          body: message,
          from: this.twilioSender,
          to: to
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

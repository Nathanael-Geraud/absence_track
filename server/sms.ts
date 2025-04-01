// SMS service that uses Twilio for production or falls back to simulation
import { smsService } from './smsService';

interface SendSmsParams {
  to: string;
  studentName: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
}

export async function sendSms(params: SendSmsParams): Promise<boolean> {
  const { to, studentName, className, date, startTime, endTime, subject } = params;
  
  // Format the recipient phone number to E.164 format if needed
  let formattedNumber = to;
    
  // Handle French numbers (starting with 0)
  if (to.startsWith('0') && to.length === 10) {
    // French number: replace initial 0 with +33
    formattedNumber = `+33${to.substring(1)}`;
    console.log(`[SMS] Formatted recipient number from ${to} to ${formattedNumber}`);
  } else if (!to.startsWith('+')) {
    // Add + prefix if missing
    formattedNumber = `+${formattedNumber}`;
    console.log(`[SMS] Added + prefix to recipient number: ${formattedNumber}`);
  }
  
  // Format the SMS message
  const message = `GestiAbsences: Votre enfant ${studentName} de la classe ${className} était absent au cours de ${subject} le ${formatFrenchDate(date)} de ${formatTime(startTime)} à ${formatTime(endTime)}.`;
  
  try {
    // Use our SMS service that utilizes Twilio if configured
    const response = await smsService.sendSMS(formattedNumber, message);
    
    if (response.success) {
      console.log(`SMS envoyé avec succès à ${formattedNumber}, ID: ${response.messageId}`);
      return true;
    } else {
      console.error(`Échec de l'envoi du SMS à ${formattedNumber}. Erreur: ${response.error}`);
      return false;
    }
  } catch (error) {
    console.error('Erreur inattendue lors de l\'envoi du SMS:', error);
    return false;
  }
}

// Helper function to format date in French
function formatFrenchDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Helper function to format time (remove seconds)
function formatTime(timeStr: string): string {
  return timeStr.substring(0, 5);
}

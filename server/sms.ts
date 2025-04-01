// SMS service that uses Twilio for production or falls back to simulation
import { smsService } from './smsService';
import { mockSmsService } from './mockSmsService';

interface SendSmsParams {
  to: string;
  studentName: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  reason?: string; // Motif de l'absence (optionnel)
}

export async function sendSms(params: SendSmsParams): Promise<boolean> {
  const { to, studentName, className, date, startTime, endTime, subject, reason } = params;
  
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
  let message = `GestiAbsences: Votre enfant ${studentName} de la classe ${className} était absent au cours de ${subject} le ${formatFrenchDate(date)} de ${formatTime(startTime)} à ${formatTime(endTime)}.`;
  
  // Ajouter le motif s'il est disponible
  if (reason && reason.trim() !== '') {
    message += ` Motif: ${reason}.`;
  }
  
  // Terminer par une note de contact
  message += ` Pour toute information, contactez l'établissement.`;
  
  try {
    // Nous utilisons maintenant un expéditeur alphanumérique,
    // donc pas besoin de vérifier si les numéros sont identiques
    console.log(`[SMS] Envoi du SMS au numéro ${formattedNumber} avec l'expéditeur alphanumérique`);
    
    // Vérifier si c'est un numéro de test pour Twilio
    const testToNumber = process.env.TWILIO_TEST_TO_NUMBER;
    let formattedTestNumber = testToNumber;
    
    // Si un numéro de test est défini, le formatter correctement pour la comparaison
    if (testToNumber) {
      if (testToNumber.startsWith('0') && testToNumber.length === 10) {
        formattedTestNumber = `+33${testToNumber.substring(1)}`;
      } else if (!testToNumber.startsWith('+')) {
        formattedTestNumber = `+${testToNumber}`;
      }
      
      // Si le numéro destinataire est le numéro de test, le mentionner dans les logs
      if (formattedNumber === formattedTestNumber) {
        console.log(`[SMS Service] Utilisation du numéro de test vérifié: ${formattedNumber} au lieu de ${to}`);
      }
    }
    
    // Utiliser le service Twilio (avec ID alphanumérique) dans tous les cas
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

// This is a simulated SMS service for demo purposes
// In a production environment, you would integrate with a real SMS provider

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
  
  // Format the SMS message
  const message = `GestiAbsences: Votre enfant ${studentName} de la classe ${className} était absent au cours de ${subject} le ${formatFrenchDate(date)} de ${formatTime(startTime)} à ${formatTime(endTime)}.`;
  
  console.log(`SMS envoyé à ${to}: ${message}`);
  
  // Simulate SMS sending success with 95% success rate
  // In a real implementation, this would call an actual SMS API
  return Math.random() < 0.95;
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

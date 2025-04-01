/**
 * Mock SMS Service - Simule l'envoi de SMS pour les tests sans Twilio
 * Utilisé uniquement lorsque le numéro Twilio et le numéro de test sont identiques
 */

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MockSMSMessage {
  id: string;
  to: string;
  message: string;
  sent: boolean;
  timestamp: Date;
}

export class MockSMSService {
  private messages: MockSMSMessage[] = [];
  private isEnabled: boolean = false;

  constructor() {
    console.log('[Mock SMS Service] Initialized and ready for testing');
    this.isEnabled = true;
  }

  /**
   * Simule l'envoi d'un SMS
   */
  async sendSMS(to: string, message: string): Promise<SMSResponse> {
    console.log(`[Mock SMS Service] Sending test SMS to ${to}`);
    console.log(`[Mock SMS Service] Message: ${message}`);
    
    // Ajoute un délai simulé (entre 0.5 et 1.5 secondes)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Génère un ID de message unique
    const messageId = `mock_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    // Enregistre le message dans notre "base de données" locale
    this.messages.push({
      id: messageId,
      to,
      message,
      sent: true,
      timestamp: new Date()
    });
    
    console.log(`[Mock SMS Service] Successfully sent test SMS to ${to}`);
    console.log(`[Mock SMS Service] Message ID: ${messageId}`);
    
    return {
      success: true,
      messageId
    };
  }
  
  /**
   * Récupère tous les messages envoyés
   */
  getAllMessages(): MockSMSMessage[] {
    return [...this.messages];
  }
  
  /**
   * Vérifie si le service mock est activé
   */
  isServiceEnabled(): boolean {
    return this.isEnabled;
  }
  
  /**
   * Efface tous les messages enregistrés
   */
  clearMessages(): void {
    this.messages = [];
    console.log('[Mock SMS Service] All messages cleared');
  }
}

// Instance singleton
export const mockSmsService = new MockSMSService();
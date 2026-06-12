/**
 * Port (interface) for sending bulk notifications (invoices, reminders, etc.).
 * Concrete adapters (email gateway, message bus, mock) live in infrastructure.
 */
export interface NotificationRecipient {
  id: string;
  name: string;
  email?: string;
}

export interface SendResult {
  sent: number;
}

export interface NotificationService {
  sendBulk(recipients: NotificationRecipient[]): Promise<SendResult>;
}

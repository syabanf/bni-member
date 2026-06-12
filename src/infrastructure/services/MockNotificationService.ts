import type {
  NotificationService,
  NotificationRecipient,
  SendResult,
} from "@/domain/services/NotificationService";

/**
 * Mock adapter that simulates a network round-trip when sending notifications.
 * Swap for an email/message-gateway adapter without touching the use cases.
 */
export class MockNotificationService implements NotificationService {
  constructor(private readonly delayMs = 1500) {}

  sendBulk(recipients: NotificationRecipient[]): Promise<SendResult> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ sent: recipients.length }), this.delayMs);
    });
  }
}

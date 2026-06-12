import type {
  NotificationService,
  NotificationRecipient,
  SendResult,
} from "@/domain/services/NotificationService";

/** Sends a notification (invoice, reminder, penalty, ...) to many recipients. */
export class SendBulkNotifications {
  constructor(private readonly notifications: NotificationService) {}

  execute(recipients: NotificationRecipient[]): Promise<SendResult> {
    return this.notifications.sendBulk(recipients);
  }
}

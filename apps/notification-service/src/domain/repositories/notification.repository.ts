import { NotificationEntity } from '../entities/notification.entity';

export const NotificationRepository = Symbol('NotificationRepository');
export interface INotificationRepository {
  findById(id: string): Promise<NotificationEntity | null>;
  save(entity: NotificationEntity): Promise<void>;
}

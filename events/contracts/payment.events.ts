export interface PaymentCompletedEvent { type: 'PaymentCompleted'; eventId: string; occurredAt: string; paymentId: string; orderId: string; amount: number; }
export interface PaymentFailedEvent { type: 'PaymentFailed'; eventId: string; occurredAt: string; paymentId: string; orderId: string; reason: string; }

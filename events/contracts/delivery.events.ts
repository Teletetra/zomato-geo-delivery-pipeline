export interface DeliveryAssignedEvent { type: 'DeliveryAssigned'; eventId: string; occurredAt: string; orderId: string; deliveryPartnerId: string; }
export interface DeliveryCompletedEvent { type: 'DeliveryCompleted'; eventId: string; occurredAt: string; orderId: string; }

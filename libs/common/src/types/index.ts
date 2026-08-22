export interface CorrelatedMessage<T = unknown> {
  eventId: string;
  occurredAt: string;
  correlationId?: string;
  payload: T;
}

import { PaymentEntity } from '../entities/payment.entity';

export const PaymentRepository = Symbol('PaymentRepository');
export interface IPaymentRepository {
  findById(id: string): Promise<PaymentEntity | null>;
  save(entity: PaymentEntity): Promise<void>;
}

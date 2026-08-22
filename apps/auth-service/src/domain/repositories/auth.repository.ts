import { AuthEntity } from '../entities/auth.entity';

export const AuthRepository = Symbol('AuthRepository');
export interface IAuthRepository {
  findById(id: string): Promise<AuthEntity | null>;
  save(entity: AuthEntity): Promise<void>;
}

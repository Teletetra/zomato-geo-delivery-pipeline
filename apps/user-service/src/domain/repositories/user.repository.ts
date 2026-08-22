import { UserEntity } from '../entities/user.entity';

export const UserRepository = Symbol('UserRepository');
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  save(entity: UserEntity): Promise<void>;
}

import { MenuEntity } from '../entities/menu.entity';

export const MenuRepository = Symbol('MenuRepository');
export interface IMenuRepository {
  findById(id: string): Promise<MenuEntity | null>;
  save(entity: MenuEntity): Promise<void>;
}

import { Injectable, OnModuleDestroy } from '@nestjs/common'; import { PrismaClient } from '@prisma/client'; import { RestaurantEntity, RestaurantProps } from '../../domain/entities/restaurant.entity'; import { IRestaurantRepository } from '../../domain/repositories/restaurant.repository';
@Injectable() export class PrismaRestaurantRepository implements IRestaurantRepository, OnModuleDestroy {
 private readonly db=new PrismaClient();
 async findById(id:string){const rows=await this.db.$queryRawUnsafe<any[]>(`SELECT id,name,description,address,"isOpen","createdAt","updatedAt" FROM "Restaurant" WHERE id=$1 LIMIT 1`,id);return rows[0]?RestaurantEntity.rehydrate(rows[0] as RestaurantProps):null;}
 async search(query?:string){const rows=query?await this.db.$queryRawUnsafe<any[]>(`SELECT id,name,description,address,"isOpen","createdAt","updatedAt" FROM "Restaurant" WHERE name ILIKE $1 OR address ILIKE $1 ORDER BY name`, `%${query}%`):await this.db.$queryRawUnsafe<any[]>(`SELECT id,name,description,address,"isOpen","createdAt","updatedAt" FROM "Restaurant" ORDER BY name`);return rows.map(r=>RestaurantEntity.rehydrate(r as RestaurantProps));}
 async save(e:RestaurantEntity){const p=e.toPrimitives(); await this.db.$executeRawUnsafe(`INSERT INTO "Restaurant" (id,name,description,address,"isOpen","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description,address=EXCLUDED.address,"isOpen"=EXCLUDED."isOpen","updatedAt"=EXCLUDED."updatedAt"`,p.id,p.name,p.description,p.address,p.isOpen,p.createdAt,p.updatedAt);}
 async delete(id:string){await this.db.$executeRawUnsafe(`DELETE FROM "Restaurant" WHERE id=$1`,id);}
 async onModuleDestroy(){await this.db.$disconnect();}
}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './interfaces/http/controllers/auth.controller';
import { RegisterHandler } from './application/commands/register.handler';
import { LoginHandler } from './application/commands/login.handler';
import { KafkaPublisher } from '@kafka/kafka.publisher';

@Module({ imports: [CqrsModule], controllers: [AuthController], providers: [KafkaPublisher, RegisterHandler, LoginHandler] })
export class AppModule {}

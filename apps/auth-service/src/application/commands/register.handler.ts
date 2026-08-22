import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { KafkaPublisher } from '@kafka/kafka.publisher';

export class RegisterCommand { constructor(public readonly email: string, public readonly password: string) {} }

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly publisher: KafkaPublisher) {}
  async execute(command: RegisterCommand) {
    const userId = randomUUID();
    // Password hashing and durable persistence are intentionally moved to the infrastructure adapter.
    await this.publisher.publish('auth.events', { type: 'UserRegistered', userId, email: command.email });
    return { userId, email: command.email };
  }
}

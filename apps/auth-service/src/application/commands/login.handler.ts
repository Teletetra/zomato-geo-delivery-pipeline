import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class LoginCommand { constructor(public readonly email: string, public readonly password: string) {} }
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  async execute(command: LoginCommand) {
    return { accessToken: 'replace-with-signed-jwt', email: command.email };
  }
}

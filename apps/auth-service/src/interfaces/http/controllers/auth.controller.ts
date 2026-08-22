import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from '../../../application/commands/register.handler';
import { LoginCommand } from '../../../application/commands/login.handler';

@Controller('auth')
export class AuthController {
  constructor(private readonly commands: CommandBus) {}
  @Post('register') register(@Body() body: { email: string; password: string }) { return this.commands.execute(new RegisterCommand(body.email, body.password)); }
  @Post('login') login(@Body() body: { email: string; password: string }) { return this.commands.execute(new LoginCommand(body.email, body.password)); }
}

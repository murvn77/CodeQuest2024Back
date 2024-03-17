import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getUserFromDiscordLogin(@Req() req: any): Promise<any> {
    console.log('req', req);
    return req.user;
  }
}

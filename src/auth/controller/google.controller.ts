import { Get, Req, UseGuards, Controller, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../auth.service';
import { AuthView } from '../auth.view';
@Controller('auth')
export class GoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authView: AuthView,
  ) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req, @Res() res) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}

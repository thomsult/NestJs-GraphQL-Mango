import { Get, Request, UseGuards, Controller } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AuthLogin } from '../auth.types';
import { AuthService } from '../auth.service';
import { AuthView } from '../auth.view';
@Controller('auth')
export class JwtController {
  constructor(
    private readonly authService: AuthService,
    private readonly authView: AuthView,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('refresh')
  getRefresh(@Request() req): Promise<AuthLogin> {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.refreshToken(token);
  }
}

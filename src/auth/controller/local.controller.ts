import {
  Get,
  UseGuards,
  Body,
  Request,
  Post,
  UsePipes,
  ValidationPipe,
  Controller,
} from '@nestjs/common';
import { SignUpDto } from '../dto/signup';
import { localAuthGuard } from '../guard/local-auth.guard';
import { AuthLogin } from '../auth.types';
import { AuthService } from '../auth.service';
import { AuthView } from '../auth.view';

@Controller('auth')
export class LocalController {
  // Get
  constructor(
    private readonly authService: AuthService,
    private readonly authView: AuthView,
  ) {}

  @Get('signup')
  Signup() {
    return this.authView.SignUpView();
  }

  @Get('login')
  Login() {
    return this.authView.LoginView();
  }

  // Post

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('signup')
  SignUpPost(@Body() signUpDto: SignUpDto) {
    return this.authService.SignUpPost(signUpDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login')
  @UseGuards(localAuthGuard)
  async LoginPost(@Request() req): Promise<AuthLogin> {
    return this.authService.login(req.user);
  }
}

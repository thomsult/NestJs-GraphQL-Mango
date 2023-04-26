import {
  Get,
  UseGuards,
  Body,
  Request,
  Post,
  UsePipes,
  ValidationPipe,
  Controller,
  NotFoundException,
  ForbiddenException,
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
    req.user = req.body;
    req.user.password = undefined;
    return this.authService.login(req.user);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('resetPassword')
  async ResetPassword(@Request() req) {
    const { email, decryptedCode, password, confirmPassword } = req.body;
    const userExist = await this.authService.FindUser(email);
    if (userExist && !decryptedCode) {
      const dbCode = await this.authService.GenerateToken(email);
      const code = Buffer.from(`${email};${dbCode}`).toString('base64');
      console.log(code, new Date().getTime()); //Send code to email todo
      return {
        message: 'Code Send',
      };
    }
    if (
      userExist &&
      decryptedCode === (await this.authService.GetToken(email))
    ) {
      if (email && password && confirmPassword) {
        return await this.authService.UpdatePassword(email, password);
      } else {
        throw new NotFoundException('Password invalid');
      }
    } else {
      throw new ForbiddenException('invalid Credentials');
    }
  }
}

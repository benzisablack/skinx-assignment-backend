import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { LoginRequestDto } from '../dto/user/login-request.dto';
import { AuthService } from './auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: LoginRequestDto) {
    return await this.authService.signIn(body.username, body.password);
  }
}

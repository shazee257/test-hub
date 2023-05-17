import {
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(AuthGuard('local'))
  loginUser(@Req() req: Request): any {
    const token = this.authService.generateToken(req.user);
    return { user: req.user, token };
  }
}

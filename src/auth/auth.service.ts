import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: any): string {
    console.log('payload', payload);
    console.log('payload.id >>>>', payload._id);
    return this.jwtService.sign({
      id: payload._id,
      email: payload.email,
      role: payload.role,
    });
  }
}

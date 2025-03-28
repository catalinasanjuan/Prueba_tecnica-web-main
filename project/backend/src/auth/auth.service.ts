import { Injectable, UnauthorizedException,forwardRef,Inject  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
    }
    return null;
}


async login(user: any) {
  const payload = { email: user.email, sub: user.id };
  return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
      },
  };
}

}
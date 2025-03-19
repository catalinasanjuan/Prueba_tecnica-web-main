import * as dotenv from 'dotenv';
import { resolve  } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });
import { Module, forwardRef } from '@nestjs/common'; 
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service'; 
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        
        console.log('🔹 JWT_SECRET desde ConfigService:', configService.get<string>('JWT_SECRET'));
        
        return {
          secret: configService.get<string>('JWT_SECRET') || 'default_secret',
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '1d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

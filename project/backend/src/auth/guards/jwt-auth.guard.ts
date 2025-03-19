import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    //const request = context.switchToHttp().getRequest();
    //const authHeader = request.headers.authorization;

    //if (!authHeader || !authHeader.startsWith('Bearer ')) {
      //console.error("❌ No se proporcionó un token válido");
      //return false;
    //}

    //const token = authHeader.split(' ')[1];
    //if (!token) return false;

    //try {
      //const decoded = this.jwtService.verify(token);
      //console.log("✅ Usuario autenticado:", decoded);
      //request.user = decoded; // Asigna el usuario decodificado a la solicitud
      //console.log('🔹 Token recibido en el Guard:', token);

      return true;
    //} catch (error) {
      //console.error("❌ Error al verificar el token:", error instanceof Error ? error.message : error);
      //return false;
    //}
    
  }
}

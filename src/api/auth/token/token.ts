import { config } from 'src/config';
import { Request } from 'express';
import { Unauthorized } from '../exception/auth.exception';

export async function generateToken(
  payload: object,
  jwtService: any,
): Promise<string> {
  const accessToken = await jwtService.signAsync(payload, {
    secret: config.ACCESS_TOKEN_KEY,
    expiresIn: config.ACCESS_TOKEN_TIME,
  });
  return accessToken;
}

export async function checkToken(
  req: Request,
  jwtService: any,
): Promise<object> {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Unauthorized();
  }
  const data = await jwtService.verify(token, {
    secret: config.ACCESS_TOKEN_KEY,
  });
  if (!data) {
    throw new Unauthorized();
  }
  return data;
}

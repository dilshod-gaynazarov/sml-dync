import { Request } from 'express';
import { Roles } from '../database/Enums';

export interface AdminAuthPayload {
  id: number;
  role: Roles;
}

export interface RequestWithPayload extends Request {
  user: AdminAuthPayload;
}

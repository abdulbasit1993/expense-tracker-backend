import { Request } from "express";

export interface getUserProfileRequest extends Request {
  token?: string;
  user?: any;
}

export interface IUser {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export interface userType extends Request {
  user?: IUser;
}

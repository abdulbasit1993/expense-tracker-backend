import { Request } from "express";

export interface getUserProfileRequest extends Request {
  token?: string;
}

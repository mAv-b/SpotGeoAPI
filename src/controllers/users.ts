import * as dotenv from 'dotenv';
import { ResponseHandler } from '.';
import { Request, Response } from "express";
import { UserService } from '../services/users';

dotenv.config();

export class UserController {

  static async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    const service = new UserService(email, password);

    const user = await service.getUserInstance();
    if (!user) {
      return ResponseHandler.notFoundResponse(
        {error: "Email or Password are invalid."},
        res
      );
    }

    const isAuthorizate = await service.authenticateUser()
    if (!isAuthorizate) {
      return ResponseHandler.notFoundResponse(
        {error: "Email or Password are invalid."},
        res
      );
    }

    const token = await service.signToken();
    return ResponseHandler.okResponse({token}, res);
  }
}
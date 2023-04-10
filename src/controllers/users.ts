import * as dotenv from 'dotenv';
import { ResponseHandler } from '.';
import { Request, Response } from "express";
import { UserService } from '../services/users';

dotenv.config();

export class UserController {

  static async authenticate(req: Request, res: Response) {
    try {

      let service;
      try {
        service = new UserService(req.body, true);
      } catch (err) {
        return ResponseHandler.badRequestResponse({ error: err }, res);
      }

      const user = await service.getUserInstance();
      if (!user) {
        return ResponseHandler.notFoundResponse(
          { error: "Email or Password are invalid." },
          res
        );
      }

      const isAuthorizate = await service.authenticateUser()
      if (!isAuthorizate) {
        return ResponseHandler.notFoundResponse(
          { error: "Email or Password are invalid." },
          res
        );
      }

      const token = await service.signToken();
      return ResponseHandler.okResponse({ token }, res);
    } catch(err) {
      ResponseHandler.internalErrorResponse(err, res);
    }
  }
}
import { Response } from "express";
import { UserController } from "./users";

class ResponseHandler {
  static readonly STATUS_OK:number = 200;
  static readonly STATUS_BAD_REQUEST:number = 400;
  static readonly STATUS_UNATHORIZATION:number = 403;
  static readonly STATUS_NOT_FOUND:number = 404;

  static notFoundResponse(body: any, res: Response) {
    res.status(ResponseHandler.STATUS_NOT_FOUND).json(body);
  }

  static okResponse(body: any, res: Response) {
    res.status(ResponseHandler.STATUS_OK).json(body);
  }
}

export { 
  ResponseHandler,
  UserController 
};
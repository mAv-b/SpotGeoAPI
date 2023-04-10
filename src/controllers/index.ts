import { Response } from "express";
import { UserController } from "./users";

class ResponseHandler {
  static readonly STATUS_OK = 200;
  static readonly STATUS_CREATED = 201;
  static readonly STATUS_NO_CONTENT = 204
  static readonly STATUS_BAD_REQUEST = 400;
  static readonly STATUS_UNATHORIZATION = 403;
  static readonly STATUS_NOT_FOUND = 404;
  static readonly STATUS_CONFLICT = 409;
  static readonly STATUS_INTERNAL_ERROR = 500;

  static internalErrorResponse(payload: any, res: Response) {
    res.status(this.STATUS_INTERNAL_ERROR).json(payload);
  }

  static conflictResponse(payload: any, res: Response) {
    res.status(this.STATUS_CONFLICT).json(payload);
  }

  static forbbidenResponse(payload: any, res: Response) {
    res.status(this.STATUS_UNATHORIZATION).json(payload);
  }

  static badRequestResponse(payload: any, res: Response) {
    res.status(this.STATUS_BAD_REQUEST).json(payload);
  }

  static notFoundResponse(payload: any, res: Response) {
    res.status(this.STATUS_NOT_FOUND).json(payload);
  }

  static okResponse(payload: any, res: Response) {
    res.status(this.STATUS_OK).json(payload);
  }

  static createdResponse(payload: any, res: Response) {
    res.status(this.STATUS_CREATED).json(payload);
  }

  static noContentResponse(res: Response) {
    res.status(this.STATUS_NO_CONTENT).send();
  }
}

export { 
  ResponseHandler,
  UserController 
};
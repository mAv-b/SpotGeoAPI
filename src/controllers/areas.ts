import { Request, Response } from "express";
import { AreaService } from "../services/areas";
import { UserService } from "../services/users";
import { ResponseHandler } from ".";

export class AreaControllers {

  static async create(req: Request, res: Response) {

    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      let service;
      try {
        service = new AreaService(req.body, false);
      } catch (err) {
        return ResponseHandler.badRequestResponse({ error: err }, res);
      }

      const area = await service.createArea();
      if (!area) {
        return ResponseHandler.conflictResponse({ error: "area already exists" }, res);
      }

      return ResponseHandler.createdResponse(area, res);

    } catch (err) {
      return ResponseHandler.internalErrorResponse(err, res);
    }

  }

  static async get(req: Request, res: Response) {

    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      const { id } = req.params;
      if (!id) {
        const areas = await AreaService.getAllArea();
        return ResponseHandler.okResponse(areas, res);
      }

      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        return ResponseHandler.badRequestResponse({ error: "invalid parameter" }, res);
      }

      const area = await AreaService.getSingleArea(idNumber);
      if (!area) {
        return ResponseHandler.notFoundResponse({ error: 'area not found' }, res);
      }

      return ResponseHandler.okResponse(area, res);

    } catch (err) {
      return ResponseHandler.internalErrorResponse(err, res);
    }

  }

  static async put(req: Request, res: Response) {
    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      const { id } = req.params;
      if (!id) {
        return ResponseHandler.badRequestResponse({ error: 'invalid parameter' }, res);
      }

      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        return ResponseHandler.badRequestResponse({ error: 'invalid parameter' }, res);
      }

      let service;
      try {
        service = new AreaService(req.body, true);
      } catch (err) {
        return ResponseHandler.badRequestResponse({ error: err }, res);
      }

      const area = await service.editArea(idNumber);
      if (!area) {
        return ResponseHandler.notFoundResponse({ error: 'area not found' }, res);
      }

      return ResponseHandler.okResponse(area, res);

    } catch (err) {
      return ResponseHandler.internalErrorResponse(err, res);
    }
  }

  static async delete(req: Request, res: Response) {
    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      const { id } = req.params;
      if (!id) {
        return ResponseHandler.badRequestResponse({ error: 'invalid parameter' }, res);
      }

      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        return ResponseHandler.badRequestResponse({ error: 'invalid parameter' }, res);
      }

      const deleted = await AreaService.deleteArea(idNumber);
      if (!deleted) {
        return ResponseHandler.notFoundResponse({ error: 'area not found' }, res);
      }

      return ResponseHandler.noContentResponse(res);

    } catch (err) {
      return ResponseHandler.internalErrorResponse(err, res);
    }
  }
}
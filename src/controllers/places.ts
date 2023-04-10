import { ResponseHandler } from ".";
import { Request, Response } from "express";
import { PlaceService } from "../services/places";
import { UserService } from "../services/users";

export class PlaceController {

  static async create(req: Request, res: Response) {
    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      let service;
      try {
        service = new PlaceService(req.body, 'POST');
      } catch (err) {
        return ResponseHandler.badRequestResponse({ error: err }, res);
      }

      const place = await service.createPlace();
      if (!place) {
        return ResponseHandler.conflictResponse(
          { error: "already exist a place with this name" },
          res
        );
      }

      return ResponseHandler.createdResponse(place, res);

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
        const places = await PlaceService.getAllPlaces();
        return ResponseHandler.okResponse(places, res);
      }

      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        return ResponseHandler.badRequestResponse({ error: "invalid parameter" }, res);
      }

      const place = await PlaceService.getPlace(idNumber);
      return ResponseHandler.okResponse(place, res);

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
      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        return ResponseHandler.badRequestResponse({ error: "invalid parameter" }, res);
      }

      let service;
      try {
        service = new PlaceService(req.body, 'PUT');
      } catch (err) {
        return ResponseHandler.badRequestResponse({ error: err }, res);
      }

      const place = await service.editPlace(idNumber);
      if (!place) {
        return ResponseHandler.notFoundResponse({ error: "place not found" }, res);
      }

      return ResponseHandler.okResponse(place, res);

    } catch (err) {
      ResponseHandler.internalErrorResponse(err, res);
    }
  }

  static async delete(req: Request, res: Response) {
    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      const { id } = req.params;
      const idNumber = Number(id);
      if (isNaN(idNumber) || !Number.isInteger(idNumber)) {
        return ResponseHandler.badRequestResponse({ error: "invalid parameter" }, res);
      }

      const deleted = await PlaceService.deletePlace(idNumber);
      if (!deleted) {
        return ResponseHandler.notFoundResponse({ error: "place id not found" }, res);
      }

      return ResponseHandler.noContentResponse(res);

    } catch (err) {
      ResponseHandler.internalErrorResponse(err, res);
    }
  }
}
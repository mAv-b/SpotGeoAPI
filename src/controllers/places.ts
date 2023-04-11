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

  // in meters
  static async distanceto(req: Request, res: Response) {
    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      const { id1, id2 } = req.params;

      const id1Number = Number(id1);
      const id2Number = Number(id2);

      const invalidId1 = isNaN(id1Number) || !Number.isInteger(id1Number);
      const invalidId2 = isNaN(id2Number) || !Number.isInteger(id2Number)

      if (invalidId1 || invalidId2) {
        return ResponseHandler.badRequestResponse({ error: "invalid parameter" }, res);
      }

      const distance = await PlaceService.pointsDistance(id1Number, id2Number);

      if (!distance) {
        return ResponseHandler.notFoundResponse({ error: "place not found" }, res);
      }

      const [[st_distance]] = distance;

      return ResponseHandler.okResponse(st_distance, res);

    } catch (err) {
      ResponseHandler.internalErrorResponse(err, res);
    }
  }

  static async isInsideOf(req: Request, res: Response) {
    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      const { idPlace, idArea } = req.params;

      const idPlaceNumber = Number(idPlace);
      const idAreaNumber = Number(idArea);

      const validIdPlaidPlace = isNaN(idPlaceNumber) || !Number.isInteger(idPlaceNumber);
      const validIdArea = isNaN(idAreaNumber) || !Number.isInteger(idAreaNumber);

      if (validIdPlaidPlace || validIdArea) {
        return ResponseHandler.badRequestResponse({error: 'invalid parameter'}, res);
      }

      const search = await PlaceService.isPlaceInsideArea(idPlaceNumber, idAreaNumber);
      if (!search) {
        return ResponseHandler.notFoundResponse({error: 'place or area not found'}, res);
      }

      return ResponseHandler.okResponse({insideof: search.st_contains}, res);

    } catch (err) {
      ResponseHandler.internalErrorResponse(err, res);
    }
  }
}
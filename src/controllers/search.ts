import { Request, Response } from "express";
import { UserService } from "../services/users";
import { ResponseHandler } from ".";
import { PlaceService } from "../services/places";
import { SearchService } from "../services/search";

export class SearchController {
  static async byRadius(req: Request, res: Response) {
    try {

      const isAuth = await UserService.auth(req.headers.authorization);
      if (isAuth['error'] !== undefined) {
        return ResponseHandler.forbbidenResponse({ error: isAuth.error }, res);
      }

      const { radius, latitude, longitude } = req.query;

      if (!radius || !latitude || !longitude) {
        return ResponseHandler.badRequestResponse({error: 'invalid parameter'}, res);
      }

      const radiusNumber = Number(radius);
      if (isNaN(radiusNumber) || !Number.isInteger(radiusNumber)) {
        return ResponseHandler.badRequestResponse({error: 'invalid parameter'}, res);
      }

      let pointService;
      try {
        pointService = new PlaceService({latitude, longitude}, 'PUT');
      } catch(err) {
        return ResponseHandler.badRequestResponse({error:err}, res);
      }

      const long = pointService.requestBody.longitude;
      const lat = pointService.requestBody.latitude;

      const longNumber = Number(long);
      const latNumber = Number(lat);

      const longInvalid = (isNaN(longNumber) || !Number.isInteger(longNumber));
      const latInvalid = (isNaN(latNumber) || !Number.isInteger(latNumber))
      if( longInvalid || latInvalid ) {
        return ResponseHandler.badRequestResponse({error: "invalid parameter"}, res);
      }

      const search = await SearchService.entitiesInRadius(radiusNumber, [long, lat]);
      return ResponseHandler.okResponse(search, res);

    } catch(err) {
      return ResponseHandler.internalErrorResponse(err, res);
    }
  }
}
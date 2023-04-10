import { Router } from "express";
import { PlaceController } from "../controllers/places";

const routes = Router();

routes.get("/", PlaceController.get);
routes.get("/:id", PlaceController.get);

routes.post("/", PlaceController.create);

routes.put('/:id', PlaceController.put);

routes.delete("/:id", PlaceController.delete);

export default routes;
import express, { Router } from "express";
const router: Router = express.Router();
import * as landMarkController from "@/controller/landmark.controller";
import { authAdminMiddleware } from "@/middleware/adminauth";

router
  .route("/")
  .get(landMarkController.GetAll)
  .post(landMarkController.Create);

router 
  .route("/zoo")
  .get(landMarkController.GetAllZoo);

router
  .route("/songkhla")
  .get(landMarkController.GetAllSongkhla);

router
  .route("/:id")
  .get(landMarkController.GetId)
  .put(landMarkController.UpdateId)
  .delete(landMarkController.DeleteId);

router
  .route("/detail")
  .post(landMarkController.UpdateDetail);

router
  .route("/temp")
  .post(authAdminMiddleware,landMarkController.UpdateLocalize);
  
export const landMarkRouter: Router = router;

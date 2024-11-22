import express,{ Router } from "express";
import * as advertisementController from "@/controller/advertisement.controller";
const router = express.Router();

router
    .route("/")
    .get(advertisementController.GetAll)
    .post(advertisementController.CreateAd);
    
export const advertisementRouter : Router = router;
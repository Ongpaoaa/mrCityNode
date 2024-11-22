import express, { Router } from "express";
const router : Router = express.Router();
import * as DataController from "@/controller/data.controller";

router
    .route("/landmarkCheckIn")
    .get(DataController.GetLandMarkCheckInCount)

router
    .route("/userLogin")
    .get(DataController.GetUserLoginCount)


export const dataRouter : Router = router
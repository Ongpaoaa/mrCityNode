import express, { Router } from "express";
const router: Router = express.Router();
import * as itemController from "@/controller/item.controller";

router.route("/")
    .get(itemController.GetAll)
    .post(itemController.Create);
    
router.route("/test")
    .post(itemController.Test);
export const itemRouter: Router = router;

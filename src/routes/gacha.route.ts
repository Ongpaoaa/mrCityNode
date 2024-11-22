import express, { Router } from "express";
const router: Router = express.Router();
import * as GachaController from "@/controller/Gacha.controller";

router.route("/")
    .get(GachaController.GetAll)
    .post(GachaController.Create);

export const gachaRouter: Router = router;
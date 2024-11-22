import express, { Router } from "express";
const router: Router = express.Router();
import * as googleController from "@/controller/google.controller";

router.route("/google").get(googleController.getAuthUrl);
router.route("/google/callback").get(googleController.googleCallBack);

export const authRouter: Router = router;

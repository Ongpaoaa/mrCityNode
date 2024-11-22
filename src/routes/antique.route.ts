import express, { Router } from "express";
const router: Router = express.Router();
import * as antiqueController from "@/controller/antique.controller";

router.route("/")
    .get(antiqueController.GetAll)
    .post(antiqueController.Create)
router.route("/id")
    .get(antiqueController.GetById)

export const antiqueRouter : Router = router;
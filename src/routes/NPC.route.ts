import express, { Router } from "express";
const router: Router = express.Router();
import * as npcController from "@/controller/NPC.controller";

router.route("/")
    .get(npcController.GetAll)
    .post(npcController.Create);
router.route("/:name").get(npcController.GetIdByName);
router.route("/:id").delete(npcController.DeleteId);

export const NPC: Router = router;
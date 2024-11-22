import express, { Router } from "express";
const router: Router = express.Router();
import * as JournalController from "@/controller/journal.controller";
import * as DataController from "@/controller/data.controller";
import { authMiddleware } from "@/middleware/auth";

router.route("/tutorial")
    .post(authMiddleware, JournalController.UpdateTotorial)

router.route("/landmarkInteraction")
    .get(DataController.GetLandMarkInteractionCount)
    .post(authMiddleware, JournalController.CreateLandmarkInteraction);

router.route("/landmarkCheckIn")
    .get(DataController.GetLandMarkCheckInCount)
    .post(authMiddleware, JournalController.CreateLandmarkCheckIn);

router.route("/NPCInteraction")
    .post(authMiddleware, JournalController.CreateNPCInteraction)

router.route("/usedItem")
    .get(authMiddleware, JournalController.GetUsedItemByPlayer);
    
router.route("/antique")
    .post(authMiddleware, JournalController.UpdateAntiqueStatus);


export const Journal: Router = router;

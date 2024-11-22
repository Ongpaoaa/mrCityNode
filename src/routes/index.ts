import express, { Router } from "express";
import { userRoute } from "./user.route";
import { authRouter } from "./auth.route";
import { questRouter } from "./quest.route";
import { itemRouter } from "./item.route";
import { landMarkRouter } from "./landmark.route";
import { inventory } from "./inventory.route";
import { NPC } from "./NPC.route";
import { Journal } from "./journal.route";
import { leaderBoardRouter } from "./leaderboard";
import { adminRouter } from "./admin.route";
import { gachaRouter } from "./gacha.route";
import { antiqueRouter } from "./antique.route";
import { dataRouter } from "./data.route";
import { FeedbackRouter } from "./feedback.route";

const router: Router = express.Router();

const api = process.env.apiVersion || "/api";
router.use(`${api}/admin`, adminRouter);
router.use(`${api}/auth`, authRouter);
router.use(`${api}/users`, userRoute);
router.use(`${api}/items`, itemRouter);
router.use(`${api}/quests`, questRouter);
router.use(`${api}/landmarks`, landMarkRouter);
router.use(`${api}/inventory`, inventory);
router.use(`${api}/npc`, NPC);
router.use(`${api}/journal`, Journal);
router.use(`${api}/leaderboard`, leaderBoardRouter);
router.use(`${api}/gacha`, gachaRouter);
router.use(`${api}/antiques`, antiqueRouter);
router.use(`${api}/data`, dataRouter);
router.use(`${api}/feedback`, FeedbackRouter);

export const indexRouter: Router = router;

import { LeaderBoard } from "@/lib/prisma";
import { Request, Response } from "express";
import * as boardService from "@/service/board.service";

export const GetLeaderBoard = async (req: Request, res: Response) => {
  try {
    const boards = await boardService.getLeaderBoard();
    res.status(200).send({ success: true, data: boards });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const GetUserRank = async (req: Request, res: Response) => {
  try {
    await boardService.updateRank();
    const user = await LeaderBoard.findUnique({
      where: {
        userId: req.userId,
      },
    });

    if (!user)
      return res
        .status(205)
        .send({ success: false, message: "user has no Rank" });

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.log(error);

    res.status(500).send({ success: false, error });
  }
};

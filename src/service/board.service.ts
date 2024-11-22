import { LeaderBoard, User } from "@/lib/prisma";

export const getLeaderBoard = async () => {
  const boards = await LeaderBoard.findMany({
    orderBy: {
      collectionCount: "desc",
    },
    take: 10,
  });
  return boards;
};

export const createUserLeaderBoard = async (userId: string) => {
  const user = await LeaderBoard.create({
    data: {
      userId: userId,
      collectionCount: 0,
      rank: 0,
    },
  });

  return user;
};

export const updateUserCollectionCount = async (userId: string) => {
  let user = await LeaderBoard.findUnique({ where: { userId: userId } });
  if (!user) user = await createUserLeaderBoard(userId);

  await LeaderBoard.update({
    where: { userId: userId },
    data: {
      collectionCount: { increment: 1 },
      lastUpdate: new Date(),
    },
  });

  return user;
};

export const updateRank = async () => {
  const users = await LeaderBoard.findMany({
    orderBy: {
      collectionCount: "desc",
    },
  });

  for (let i = 0; i < users.length; i++) {
    await LeaderBoard.update({
      where: { id: users[i].id },
      data: {
        rank: i + 1,
      },
    });
  }
};

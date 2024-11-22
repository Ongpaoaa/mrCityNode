import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const User = prisma.user;
export const Session = prisma.session;
export const Quest = prisma.quest;
export const Item = prisma.item;
export const Gacha = prisma.gacha;
export const Landmark = prisma.landMark;
export const UserItem = prisma.userItem;
export const NPC = prisma.nPC;
export const Antique = prisma.antique;
export const Advertisement = prisma.advertisement;
export const Shop = prisma.shop;

export const CompletedQuest = prisma.completedQuest;
export const LandmarkCheckin = prisma.landMarkCheckIn;
export const LandMarkInteract = prisma.landMarkInteract;
export const LeaderBoard = prisma.leaderBoard;
export const NPCInteract = prisma.nPCInteract;
export const ItemUsed = prisma.itemUsed;
export const GachaTicketUsed = prisma.gachaTicketUsed;
export const AntiqueInteract = prisma.antiqueInteract;
export const AntiqueUsed = prisma.antiqueUsed;
export const AntiqueNavigate = prisma.antiqueNavigate;
export const UserLogin = prisma.userLogin;

export const Admin = prisma.admin;

export const FeedBackQuestion = prisma.feedBackQuestion;
export const FeedBackAnswer = prisma.feedBackAnswer;



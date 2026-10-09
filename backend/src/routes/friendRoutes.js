import express from "express";

import { acceptFriendRequest } from "../controllers/friendController.js";
import { rejectFriendRequest } from "../controllers/friendController.js";
import { getAllFriends } from "../controllers/friendController.js";
import { getFriendRequests } from "../controllers/friendController.js";
import { sendFriendRequest } from "../controllers/friendController.js";

const router = express.Router();

router.post("/requests", sendFriendRequest);

router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post("/requests/:requestId/reject", rejectFriendRequest);

router.get("/requests", getFriendRequests);
router.get("/", getAllFriends);

export default router;
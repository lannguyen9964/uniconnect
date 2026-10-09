import express, { Router } from 'express'

import { sendDM, sendGM } from '../controllers/messageController.js'
import { checkFriendship, checkGroupMembership } from '../middlewares/friendMiddleware.js';

const router = express.Router();

router.post('/private', checkFriendship, sendDM);
router.post('/group', checkGroupMembership, sendGM);

export default router;
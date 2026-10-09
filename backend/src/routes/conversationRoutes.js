import express from 'express'
import { createConversation, markAsSeen } from '../controllers/conversationController.js'
import { getConversations } from '../controllers/conversationController.js'
import { getMessages } from '../controllers/conversationController.js'

const router = express.Router();

router.post("/", createConversation);
router.get("/", getConversations);
router.get("/:conversationId/messages", getMessages);
router.patch("/:conversationId/seen", markAsSeen)

export default router;
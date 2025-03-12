import express from 'express';
import { Message } from '../models/messageModel';

const router = express.Router();

router.get('/messages', async (req, res) => {
  const messages = await Message.find().populate('sender', 'username').sort({ timestamp: 1 });
  res.json(messages);
});

export default router;

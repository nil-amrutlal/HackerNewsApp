import express from 'express';
import { StoryControler } from '../controllers/story.controller';

const router = express.Router();

router.get('/TopWords', StoryControler.getTopWords);
router.get('/LastWeekPostWords', StoryControler.getLastWeekPostWords);

export = router;

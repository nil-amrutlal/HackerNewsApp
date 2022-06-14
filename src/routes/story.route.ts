import express from 'express';
import { StoryControler } from '../controllers/story.controller';

const router = express.Router();

router.get('/getTopWords', StoryControler.getTopWords);
router.get('/getLastWeekPostWords', StoryControler.getLastWeekPostWords);

export = router;

import express from 'express';
import controller from '../controllers/stories';
const router = express.Router();


router.get('/test', controller.getLastestStories);

router.get('/storyInfo', controller.getStoryInfo);

export = router;
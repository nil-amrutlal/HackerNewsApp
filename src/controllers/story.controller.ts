import { Request, Response } from 'express';
import { StoryService } from '../services/story.service';

export class StoryControler {
    static getTopWords = async (req: Request, res: Response) => {
        await StoryService.getTopWords(25)
            .then((data) => {
                res.status(200).send({ error: false, data });
            })
            .catch((err) => {
                res.status(500).send({
                    error: true,
                    message: err.name,
                    data: [],
                });
            });
    };

    static getLastWeekPostWords = async (req: Request, res: Response) => {
        await StoryService.getTopWordsFromOldPost(7)
            .then((data) => {
                res.status(200).send({ error: false, data });
            })
            .catch((err) => {
                res.status(500).send({
                    error: true,
                    message: err.name,
                    data: [],
                });
            });
    };
}

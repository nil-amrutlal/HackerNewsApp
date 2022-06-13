import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { StoryService } from '../services/story.service';

// const getTop

export class StoryControler {
    static getTopWords = async (req: Request, res: Response) => {

        await StoryService.getTopWords(25)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    };

    static getLastWeekPostWords = async (req: Request, res: Response) => {
        try {
            const topWords = await StoryService.getTopWordsFromOldPost(7);
            res.status(200).send({ error: false, data: topWords });
        } catch (e) {
            res.status(401).send(e);
        }
    };

    static testHackerNews = async (req: Request, res: Response) => {
        await StoryService.testHackerNews()
        .then((result) => {
            res.status(200).send({ error: false, data: result})
        })
        .catch((err) => {
            res.status(400).send({ error: true, message: err.name, data: []})
        });

    }
}


// // getting latest stories
// const getLastestStories = async (req: Request, res: Response, next: NextFunction) => {
//     let result: AxiosResponse = await axios.get(`${baseUrl}/newstories.json?print=pretty`);
//     let stories: [Number] = result.data;
//     return res.status(200).json({
//         latestStories: stories
//     });
// };

// const getStoryInfo = async(req: Request, res: Response, next: NextFunction) => {

//     getLastestStories1()
//         .then(lastestStories => lastestStories.slice(0, 25).map((stories , index) =>
//             console.log(index, " - ", stories)));

//     let result: AxiosResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/31703550.json?print=pretty`);
//     let storyData: Story = result.data;
//     return res.status(200).json({
//         message: storyData
//     })
// }

// async function getLastestStories1() {
//     let result : AxiosResponse = await axios.get(`${baseUrl}/newstories.json?print=pretty`);
//     let stories: [Number] = result.data;
//     return stories;
// }

// export default { getLastestStories, getStoryInfo };

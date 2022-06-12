import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { StoryService } from '../services/story.service';



// const getTop

export class StoryControler{


    static getTopWords = async(req: Request, res: Response) => {
        try {
            const topWords = await StoryService.getTopWords(25);
            console.log(topWords);
            res.status(200).send(topWords);
        } catch (e) {
            res.status(500).send(e);
        }
        
    }


    static getLastWeekPostWords = async(req: Request, res: Response) => {
        try {
            const topWords = await StoryService.getTopWords(25);
            console.log(topWords);
            res.status(200).send(topWords);
        } catch (e) {
            res.status(500).send(e);
        }
        
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
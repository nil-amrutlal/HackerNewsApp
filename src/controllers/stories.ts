import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';

interface Story {
    id: Number;
    deleted: boolean;
    type: string;
    by: string;
    time: Number;
    dead: boolean;
    kids: [{
        id: Number
    }];
    descendants: Number;
    score: Number;
    title: string;
    url: string
}

let baseUrl : string = "https://hacker-news.firebaseio.com/v0/"


// getting latest stories
const getLastestStories = async (req: Request, res: Response, next: NextFunction) => {
    let result: AxiosResponse = await axios.get(`${baseUrl}/newstories.json?print=pretty`);
    let stories: [Number] = result.data;
    return res.status(200).json({
        latestStories: stories
    });
};

const getStoryInfo = async(req: Request, res: Response, next: NextFunction) => {

    getLastestStories1()
        .then(lastestStories => lastestStories.slice(0, 25).map((stories , index) =>
            console.log(index, " - ", stories)));

        
    let result: AxiosResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/31703550.json?print=pretty`);
    let storyData: Story = result.data;
    return res.status(200).json({
        message: storyData
    })
}


async function getLastestStories1() {
    let result : AxiosResponse = await axios.get(`${baseUrl}/newstories.json?print=pretty`);
    let stories: [Number] = result.data;
    return stories;
}

export default { getLastestStories, getStoryInfo };
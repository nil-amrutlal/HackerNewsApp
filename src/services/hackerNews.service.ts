import axios, { AxiosResponse } from 'axios';
import { Story } from '../interfaces/story.interface';

export class HackerNewsService {
    static baseUrl: string = 'https://hacker-news.firebaseio.com/v0/';

    static getLastestStories = async (noStories: number): Promise<number[]> => {
        return await axios
            .get(`${this.baseUrl}/newstories.json?print=pretty`)
            .then((res) => {
                let stories = res.data;
                return stories.slice(0, noStories);
                });
    };

    static getStoryInfo = async (id: number): Promise<Story> => {
        return await axios
            .get(`${this.baseUrl}/item/${id}.json?print=pretty`)
            .then((res) => {
                const storyInfo: Story = res.data;
                return storyInfo;
            });
    };


}
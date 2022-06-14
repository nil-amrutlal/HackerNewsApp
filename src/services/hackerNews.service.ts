import axios from 'axios';
import { Story } from '../interfaces/story.interface';

export class HackerNewsService {
    static baseUrl: string = 'https://hacker-news.firebaseio.com/v0/';

    static getLastestStories = async (noStories: number): Promise<number[]> => {
        const res = await axios.get(
            `${this.baseUrl}/newstories.json?print=pretty`
        );
        const stories: number[] = res.data;
        return stories.slice(0, noStories);
    };

    static getStoryInfo = async (id: number): Promise<Story> => {
        const res = await axios.get(
            `${this.baseUrl}/item/${id}.json?print=pretty`
        );
        const storyInfo: Story = res.data;
        return storyInfo;
    };
}

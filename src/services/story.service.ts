import { HackerNewsService } from './hackerNews.service';
import { Story } from '../interfaces/story.interface';
import { IDictionary } from '../interfaces/dictionary.interface';

export class StoryService {

    constructor() {}


    public getWordCount = (titles: Array<string>): IDictionary => {
        const count: IDictionary = {};
        titles.forEach((title) => {
            const wordArray = title
                .replace(/[^a-z0-9A-Z ]/gi, '')
                .toLowerCase()
                .split(' ');
            for (const word of wordArray) {
                if (word === ' ' || word === '') {
                    continue;
                }
                count[word] = count[word] ? count[word] + 1 : 1;
            }
        });
        return count;
    };

    
    public sortDictionary = (dictionary: IDictionary, noEntries: number) : string[] => {
        const dictionaryArr = Object.keys(dictionary).map((key) => [
            key,
            dictionary[key],
        ]);
        dictionaryArr.sort((a, b) => Number(b[1]) - Number(a[1]));
        const topWords = dictionaryArr
            .slice(0, noEntries)
            .map((item) => item[0].toString());
        
        return topWords;
    }


    public getTopWords = async (noTopWords: number): Promise<string[]> => {
        const latestStories = await HackerNewsService.getLastestStories(25);

        const titleArr: Array<string> = await Promise.all(
            latestStories.map(async (storyID): Promise<any> => {
                const storyDetails = await HackerNewsService.getStoryInfo(storyID);
                return storyDetails.title? storyDetails.title : '';
            })
        );

        const wordCount = this.getWordCount(titleArr);
        const topWords = this.sortDictionary(wordCount, noTopWords);
        // const wordCountArr = Object.keys(wordCount).map((key) => [
        //     key,
        //     wordCount[key],
        // ]);
        // wordCountArr.sort((a, b) => Number(b[1]) - Number(a[1]));
        // const topWords = wordCountArr
        //     .slice(0, noTopWords)
        //     .map((item) => item[0].toString());

        return topWords;
    };


    // Get the ratio of unix jump per id
    public async getIDUnixRatioFromList(idList: number[]): Promise<number> {
        if (idList.length === 0) {
            return 0;
        }
        const lastID = idList[0];
        const firstID = idList[idList.length - 1];
        const lastUnix = (await HackerNewsService.getStoryInfo(lastID)).time;
        const firstUnix = (await HackerNewsService.getStoryInfo(firstID)).time;
        const unixDiff = Number(lastUnix) - Number(firstUnix);
        const idDiff = lastID - firstID;
        return unixDiff / idDiff;
    }


    public async getRandomStoryFromDate(lastId: number, ratio: number, days: number): Promise<Story> {
        let approximateStory: Story;
        const pastDateStart = new Date();
        const pastDateEnd = new Date();
        pastDateStart.setHours(0, 0, 1);
        pastDateEnd.setHours(23, 59, 59);
        const pastDateUnixStartStamp = this.getPastUnixTimeStamp(pastDateStart, days);
        const pastDateUnixEndStamp = this.getPastUnixTimeStamp(pastDateEnd, days);

        // Gets the estimated id jump depending on how many days we want to go back
        const daysInUnix = 60 * 60 * 24 * days;
        const approximateIdJump = Math.round(daysInUnix / ratio);
        let idAttempt = lastId - approximateIdJump;
        let multiplier : number = 1;

        do {
            approximateStory = await HackerNewsService.getStoryInfo(idAttempt);

            // Default Jump
            let newIdJump = Math.round(ratio) * multiplier;

            // If less than Start Unix Time Stamp : Id is incresed
            if (approximateStory.time && approximateStory.time < pastDateUnixStartStamp) {
                newIdJump = Math.round((pastDateUnixStartStamp - Number(approximateStory.time)) / ratio);
                if(newIdJump < 1){
                    newIdJump = 1;
                }
                idAttempt += newIdJump;

            // If bigger than End Unix Time Stamp : Id is reduced
            } else if (approximateStory.time && approximateStory.time > pastDateUnixEndStamp) {
                newIdJump = Math.round((Number(approximateStory.time) - pastDateUnixEndStamp) / ratio);
                if(newIdJump < 1 ) {
                    newIdJump = 1;
                }
                idAttempt -= newIdJump;

            // If in bounds check for parent
            } else if (approximateStory.parent){ 
                idAttempt = approximateStory.parent;

            // Default Behaviour
            } else {
                multiplier += 1;
                idAttempt += newIdJump;
            }
            
        } while (!approximateStory.time || !approximateStory.title ||
            approximateStory.time < pastDateUnixStartStamp || approximateStory.time > pastDateUnixEndStamp ||
            approximateStory.type.toString().toLowerCase() !== 'story'
        );

        return approximateStory;
    }


    public getPastUnixTimeStamp(date: Date, daysAgo: number): number {
        date.setDate(date.getDate() - daysAgo);
        return Math.round(Number(date) / 1000);
    }

    public async getTopWordsFromOldPost(daysAgo: number) {
        const wordArr: string[] = [];
        const latestStories = await HackerNewsService.getLastestStories(500);
        const IdUnixRatio = await this.getIDUnixRatioFromList(latestStories);
        const pastStory = await this.getRandomStoryFromDate(
            latestStories[0],
            IdUnixRatio,
            daysAgo
        );
        if (pastStory.title) {
            wordArr.push(pastStory.title);
        }
        const wordCount = this.getWordCount(wordArr);
        const topWords = this.sortDictionary(wordCount, 10);
        return topWords;
    }
}

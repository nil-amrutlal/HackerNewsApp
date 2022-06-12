import { Story } from '../interfaces/story.interface';
import { IDictionary } from '../interfaces/dictionary.interface';
import axios, { AxiosResponse } from 'axios';

export class StoryService {
    static baseUrl: string = 'https://hacker-news.firebaseio.com/v0/';

    static getLastestStories = async (noStories: number): Promise<number[]> => {
        return new Promise((resolve, reject) => {
            let stories: number[] = [];
            try {
                axios
                    .get(`${this.baseUrl}/newstories.json?print=pretty`)
                    .then((res) => {
                        stories = res.data;
                        resolve(stories.slice(0, noStories));
                    });
            } catch (error) {}
        });
    };

    static getStoryInfo = async (id: number): Promise<Story> => {
        return new Promise((resolve, reject) => {
            axios
                .get(`${this.baseUrl}/item/${id}.json?print=pretty`)
                .then((res) => {
                    let storyInfo: Story = res.data;
                    resolve(storyInfo);
                });
        });
    };

    static getWordCount = (titles: Array<string>): IDictionary => {
        var count: IDictionary = {};
        titles.forEach((title) => {
            const wordArray = title
                .replace(/[^a-z0-9A-Z ]/gi, '')
                .toLowerCase()
                .split(' ');
            for (const word of wordArray) {
                if (word == ' ' || word == '') {
                    continue;
                }
                count[word] = count[word] ? count[word] + 1 : 1;
            }
        });
        return count;
    };

    static getTopWords = async (noTopWords: number): Promise<string[]> => {
        const latestStories = await this.getLastestStories(25);

        let titleArr: Array<string> = await Promise.all(
            latestStories.map(async (storyID): Promise<any> => {
                let storyDetails = await this.getStoryInfo(storyID);
                return storyDetails.title;
            })
        );

        let wordCount = this.getWordCount(titleArr);
        let wordCountArr = Object.keys(wordCount).map((key) => {
            return [key, wordCount[key]];
        });
        wordCountArr.sort((a, b) => {
            return Number(b[1]) - Number(a[1]);
        });
        let topWords = wordCountArr.slice(0, noTopWords).map((item) => {
            return item[0].toString();
        });

        return topWords;
    };

    //Get the ratio of unix jump per id
    static async getIDUnixRatioFromList(idList: number[]): Promise<number> {
        let lastID = idList[0];
        let firstID = idList[idList.length - 1];

        let lastUnix = (await this.getStoryInfo(lastID)).time;
        let firstUnix = (await this.getStoryInfo(firstID)).time;

        if (firstUnix && lastUnix) {
            const unixDiff = Number(lastUnix) - Number(firstUnix);
            const idDiff = lastID - firstID;
            return unixDiff / idDiff;
        }
        return 0;
    }

    static async getRandomStoryFromDate(
        lastId: number,
        ratio: number,
        days: number
    ): Promise<Story> {
        let pastDateStart = new Date();
        let pastDateEnd = new Date();
        pastDateStart.setHours(0, 0, 1);
        pastDateEnd.setHours(23, 59, 59);

        let pastDateUnixStartStamp = this.getPastUnixTimeStamp(
            pastDateStart,
            days
        );
        let pastDateUnixEndStamp = this.getPastUnixTimeStamp(pastDateEnd, days);

        // Gets the estimated id jump depending on how many days we want to go back
        const daysInUnix = 60 * 60 * 24 * days;
        let approximateIdJump = Math.round(daysInUnix / ratio);
        let idAttempt = lastId - approximateIdJump;
        let approximateStory = await this.getStoryInfo(idAttempt);

        do {
            console.log('Do');
            approximateStory = await this.getStoryInfo(idAttempt);
            console.log('Start : ', pastDateUnixStartStamp);
            console.log('End : ', pastDateUnixEndStamp);
            console.log('Current Story : ', approximateStory.time);
            // console.log("Current Type : " , approximateStory.type);

            //Default Jump
            let newIdJump = 1000;

            //If less than Start Unix Time Stamp : Id is incresed
            if (
                approximateStory.time &&
                approximateStory.time < pastDateUnixStartStamp
            ) {
                let newIdJump = Math.round(
                    (pastDateUnixStartStamp - Number(approximateStory.time)) /
                        ratio
                );
                idAttempt = idAttempt + newIdJump;
                //If bigger than End Unix Time Stamp : Id is reduced
            } else if (
                approximateStory.time &&
                approximateStory.time > pastDateUnixEndStamp
            ) {
                let newIdJump = Math.round(
                    (Number(approximateStory.time) - pastDateUnixEndStamp) /
                        ratio
                );
                idAttempt = idAttempt - newIdJump;
                //If in bounds, check for parent
            } else {
                if (approximateStory.parent) {
                    idAttempt = approximateStory.parent;
                }
            }
            // console.log("New Jump : " , newIdJump);
            console.log('New ID : ', idAttempt);

            // console.log(!approximateStory.time);
            // console.log(approximateStory.time < pastDateUnixStartStamp);
            // console.log(approximateStory.time > pastDateUnixEndStamp);
            // console.log(approximateStory.type.toLowerCase() !== "story" );
            console.log(
                !approximateStory.time ||
                    approximateStory.time < pastDateUnixStartStamp ||
                    approximateStory.time > pastDateUnixEndStamp ||
                    approximateStory.type.toString().toLowerCase() !== 'story'
            );
        } while (
            !approximateStory.time ||
            approximateStory.time < pastDateUnixStartStamp ||
            approximateStory.time > pastDateUnixEndStamp ||
            approximateStory.type.toString().toLowerCase() !== 'story'
        );

        // while(!approximateStory.time || approximateStory.time > pastDateUnixStartStamp ||
        //     approximateStory.time < pastDateUnixEndStamp || approximateStory.type.toLowerCase() !== "story"){

        // }

        console.log(approximateStory);

        return approximateStory;
    }

    static getPastUnixTimeStamp(date: Date, daysAgo: number): number {
        date.setDate(date.getDate() - daysAgo);
        return Math.round(Number(date) / 1000);
    }

    static async getTopWordsFromOldPost(daysAgo: number) {
        console.log('Entrei Service');
        let wordArr: string[] = [];
        const latestStories = await this.getLastestStories(500);
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
        console.log(wordCount);

        return wordCount;
    }
}

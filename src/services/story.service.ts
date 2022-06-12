import { Story } from '../interfaces/story.interface';
import { IDictionary } from '../interfaces/dictionary.interface';
import axios, { AxiosResponse } from 'axios';


export class StoryService {

    static baseUrl : string = "https://hacker-news.firebaseio.com/v0/";

    static getLastestStories = async(noStories : number) : Promise<number[]> => {

        return new Promise((resolve, reject) => {
            let stories : number[] = [];
            try {
                axios
                .get(`${this.baseUrl}/newstories.json?print=pretty`)
                .then( res => {
                    stories = res.data;
                    resolve(stories.slice(0,noStories));
                });
            } catch (error) {

            }

        })
    };



    static getStoryInfo = async(id : number) : Promise<Story> => {

        return new Promise((resolve, reject) => {
            axios
                .get(`${this.baseUrl}/item/${id}.json?print=pretty`)
                .then( res => {
                    let storyInfo : Story = res.data ;
                    resolve(storyInfo);
                })
        })
    }

    static getWordCount = (titles : Array<string>) : IDictionary => {
        var count: IDictionary = {};
        titles.forEach((title) => {
            const wordArray = title.replace(/[^a-z0-9A-Z ]/gi, '').toLowerCase().split(" ");
            for (const word of wordArray) {
                if(word == " " || word == "") {
                    continue;
                }
                count[word] = count[word] ? count[word] + 1 : 1 ;
            }
        })        
        return count;
    }



    static getTopWords = async(noWords: number) : Promise<string[]> => {
        const latestStories = await this.getLastestStories(25);

        let titleArr : Array<string> = await Promise.all(latestStories.map(async(storyID) : Promise<any> => {
            let storyDetails = await this.getStoryInfo(storyID);
            return storyDetails.title; 
        }));

        let wordCount = this.getWordCount(titleArr);
        let wordCountArr = Object.keys(wordCount).map((key) => {
            return [key, wordCount[key]];
        })
        wordCountArr.sort((a, b) => { return Number(b[1]) - Number(a[1]) });
        let topWords = wordCountArr.slice(0, noWords).map((item) => {
            return item[0].toString();
        })

        return topWords;
    }


    static async getIDUnixRatio(firstID : number, lastID: number) {
        let firstUnix = (await this.getStoryInfo(firstID)).time;
        let lastUnix =  (await this.getStoryInfo(lastID)).time;

        console.log(firstUnix);
        console.log(lastUnix);

    }
    
}
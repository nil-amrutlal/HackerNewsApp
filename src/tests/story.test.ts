import { StoryService } from '../services/story.service';

const storyService = new StoryService();

describe('StoryService: Top Words', () => {
    test('Data Type', async () => {
        const data = await storyService.getTopWords(10);
        expect(typeof data).toBe('object');
        expect(typeof data[0]).toBe('string');
    });
    test('Data Length', async () => {
        const data = await storyService.getTopWords(13);
        expect(data).toHaveLength(13);
    });
});

describe('StoryService: Word Count', () => {
    const array = [
        'the.* THE',
        'hello',
        'the weather is good.',
        'today is the best day',
    ];
    const data = storyService.getWordCount(array);
    test('Data correctness', () => {
        expect(data.the).toBe(4);
        expect(data.is).toBe(2);
        expect(data.today).toBe(1);
        expect(data.the).toBe(4);
        expect(data.is).toBe(2);
        expect(data.today).toBe(1);
        expect(data.abc).toBeNull;
        expect(data['.']).toBeNull;
    });
    test('Data Length', () => {
        expect(Object.keys(data)).toHaveLength(8);
    });
});

describe('Story Service: Get Unix / Id Ratio', () => {
    const idArray = [31707025, 31706386, 31706335];
    const emptyArray: Array<number> = [];
    test('Filled Array', async () => {
        const data = await storyService.getIDUnixRatioFromList(idArray);
        expect(typeof data).toBe('number');
    });
    test('Empty Array', async () => {
        const data = await storyService.getIDUnixRatioFromList(emptyArray);
        expect(typeof data).toBe('number');
        expect(data).toBe(0);
    });
});

describe('Story Service: Get Top Words From Old Post', () => {
    test('Get Words from a story posted 7 days ago', async () => {
        const data = await storyService.getTopWordsFromOldPost(7);
        expect(typeof data).toBe('object');
        expect(Object.keys.length).toBeGreaterThan(0);
    });
});

describe('Story Service: Get Past Unix Timestamp', () => {
    test('Get 7 days ago Unix Time', () => {
        const date = new Date();
        const data = storyService.getPastUnixTimeStamp(date, 7);
        expect(typeof data).toBe('number');
    });
});

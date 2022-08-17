import { Alignment } from './alignment';
import { Transcription } from './transcription';
export declare class StringAligner {
    targetSequence: string[];
    targetTimestamps: number[][];
    aligner: Alignment;
    deletionPenalty: number;
    insertionPenalty: number;
    substitutionPenalty: number;
    insertBetweenParagraphsPenalty: number;
    currentWord: string;
    currentWordBegin: number;
    constructor(targetSequence: string[], targetTimestamps: number[][], insertionPenalty: number, deletionPenalty: number, substitutionPenalty: number, insertBetweenParagraphsPenalty: number, chunkSize: number);
    static string2array(str: string): string[];
    static string2words(str: string): string[];
    static cleanWords(words: string[]): string[];
    distortWords(sequence: string[], errorRate: number): string[];
    wordInsertionPenalty: (insertedWord: string, matchingWord: string) => number;
    wordDeletionPenalty: (a: string) => number;
    prefixDistance: (a: string, b: string) => number;
    static exactMatchDistance: (a: string, b: string) => 1 | 0;
    indexAfterTime(time: number): number;
    indexBeforeTime(time: number): number;
    compareSequence(sourceSequence: string[], timeFrom: number, timeTo: number): number[];
    applyTimestamps(words: string[], matchIndices: any[]): Transcription;
    static cleanWord(word: string): string;
    extendCurrentWord(word: string, begin: number): void;
    cleanCurrentWord(): void;
    isWordEnd(word: string): boolean;
    splitWords(text: string): string[];
    addNewWord(word: string, begin: number, end: number): void;
}
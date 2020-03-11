import * as moment from 'moment';

const DOMParser = require('xmldom').DOMParser;

const TRSX_HEADER = '\n\
<?xml version="1.0" encoding="utf-8" standalone="yes"?>\n\
<transcription version="3.0">\n\
  <ch name="">\n\
    <se name="0">\n\
      <pa b="PT0S" e="PT20H0M0S" s="0">\n';
const TRSX_FOOTER = '\n\
      <pa b="PT0S" e="PT20H0M0S" s="0">\n\
    <se name="0">\n\
  <ch name="">\n\
</transcription version="3.0">\n';
export class Transcription {
    words: string[];
    timestamps: number[][];
    length: number;
    text: string;

    constructor(trsx?: string) {
        this.words = [];
        this.timestamps = [];
        this.length = 0;
        this.text = '';
        if (trsx) {
            this.fromTrsx(trsx);
        }
    }

    loadPhraseRaw(text: string, begin: number, end: number) {
        if (text.length !== 0) {
            this.words.push(text);
            this.length += 1;
            this.timestamps.push([begin, end]);
            this.text += text;
        }
    }

    loadPhraseXml(phrase: Element) {
        const text = phrase.textContent;
        let words = text.split(' ');
        const begin = moment.duration(phrase.getAttribute('b')).asSeconds();
            const end = moment.duration(phrase.getAttribute('e')).asSeconds();
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            this.loadPhraseRaw(word, begin, end);
        }
    }

    fromTrsx(trsx: string) {
        const xmlParser = new DOMParser();
        const xml = xmlParser.parseFromString(trsx, 'text/xml');
        const phrases = xml.getElementsByTagName('p');
        for (let i = 0; i < phrases.length; i += 1) {
            this.loadPhraseXml(phrases[i]);
        }
    }

    exportTrsx() {
        const phrases: string[] = [];
        for (let i = 0; i < this.words.length; i += 1) {
            let text = this.words[i];
            const [ begin, end ] = this.timestamps[i];
            // merge words with the same timestamps
            for (let j = i + 1; j < this.timestamps.length && this.timestamps[j][0] === begin; j += 1) {
                text += this.words[j] + ' ';
                i = j;
            }
            const phrase = `        <p b="${begin}" e="${end}">${text}</p>\n`;
            phrases.push(phrase);
        }
        return [TRSX_HEADER, ...phrases, TRSX_FOOTER].join('');
    }

    getText() {
        return this.text;
    }
}
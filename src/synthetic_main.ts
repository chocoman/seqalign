import { Alignment } from './alignment';
import { Visualization } from './visualization';
import { StringAligner } from './stringaligner';


async function fetchText(url: string) {
    const response = await fetch(url);
    return response.text();
}


/*
let stringAligner = new StringAligner();
let aligner: Alignment<string>;
// const visualization = new Visualization('reference', 'distorted', 'begin', 'end');
let reference: string;
let referenceSequence: string[];

async function main() {
    const reference = await fetchText('res/1_26.oga.txt');
    referenceSequence = stringAligner.string2words(reference);
    // visualization.visualizeTarget(referenceSequence, null);
    const wer = 0.8;
    let distortedSequence = stringAligner.distortWords(referenceSequence, wer);
    const matchIndices = stringAligner.compareSequences(referenceSequence, distortedSequence);
    // visualization.visualizeSource(distortedSequence, matchIndices);
    return Promise.resolve();
}

main();
*/
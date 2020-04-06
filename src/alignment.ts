import { Counter } from './counter';
enum Op {
          Begin = 0,
          Insert,
          Substitute,
          Match,
          Delete
        }

const PATTERN_LENGTH = 15;

export class Alignment {
  a: string[];
  chunkSize: number;

  insertionPenalty: (x: string, y: string) => number;
  deletionPenalty: (x: string) => number;
  distance: (x: string, y: string) => number;
  constructor(baseSequence: string[],
              distance: (x: string, y: string) => number,
              insertionPenalty: (x: string, y: string) => number,
              deletionPenalty: (x: string) => number,
              chunkSize: number) {
    this.a = baseSequence;
    this.distance = distance;
    this.insertionPenalty = insertionPenalty;
    this.deletionPenalty = deletionPenalty;
    this.chunkSize = chunkSize;
  }

  push(newEntry: string) {
      this.a.push(newEntry);
  }

  findBestMatchForPattern(pattern: string[], targetFrom: number, targetTo: number) {
      const patternBag = new Counter();
      const windowBag = new  Counter();
      for (let i = 0; i < pattern.length; i += 1) {
        patternBag.increment(pattern[i], +1);
        windowBag.increment(this.a[targetFrom + i], +1);
      }
      let bestMatchScore = 0;
      let bestMatchIndex = 0;
      for (let j = targetFrom; j < targetTo - pattern.length; j += 1) {
        const matchScore = windowBag.getIntersectSize(patternBag); // TODO optimize
        if (matchScore > bestMatchScore) {
            bestMatchScore = matchScore;
            bestMatchIndex = j;
        }
        windowBag.increment(this.a[j], -1);
        windowBag.increment(this.a[j + pattern.length], +1);
      }
      if (bestMatchScore < PATTERN_LENGTH / 2) return null; // match not good enough
      return bestMatchIndex;
  }

  getCountInArray(element: any, array: any[]) {
      let count = 0;
      for (let i = 0; i < array.length; i += 1) {
          if (array[i] === element) count += 1;
      }
      return count;
  }

  getMatchingWords(source: string[], target: string[]) {
    for (let i = 0; i < source.length; i += 1) {
        // matching words must have similar index
        for (let j = Math.max(0, i - 2); j < Math.min(target.length, i + 3); j += 1) {
            if (source[i] === target[j]) {
                // matching words must be unique in both sequences
                if (
                    this.getCountInArray(source[i], source) === 1
                    && this.getCountInArray(target[j], target) === 1
                ) {
                    return [i, j];
                }
            }
        }
    }
    return [null, null];
  }

  getPivots(source: string[], targetFrom: number, targetTo: number) {
    const pivotRangeStart = Math.floor(source.length * 0.5);
    const pivotRangeEnd = Math.floor(source.length * 0.8);
    const increment = Math.floor(source.length * 0.05);
    for (let patternStart = pivotRangeStart; patternStart < pivotRangeEnd; patternStart += increment) {
        const [pivot1, pivot2] = this.getPivotsAt(source, targetFrom, targetTo, patternStart);
        if (pivot1 !== null) {
            return [pivot1, pivot2];
        }
    }
    throw new Error('no match found');
  }

  getPivotsAt(source: string[], targetFrom: number, targetTo: number, patternStart: number) {
    const patternEnd = patternStart + PATTERN_LENGTH;
    const pattern = source.slice(patternStart, patternEnd);
    const matchedPatternIndex = this.findBestMatchForPattern(pattern, targetFrom, targetTo);
    const [ wordMatchSource, wordMatchTarget ] = this.getMatchingWords(
        pattern,
        this.a.slice(matchedPatternIndex, matchedPatternIndex + PATTERN_LENGTH)
    );
    const matchSource = patternStart + wordMatchSource;
    const matchTarget = matchedPatternIndex + wordMatchTarget;
    if (matchedPatternIndex === null || wordMatchSource === null || source[matchSource] !== this.a[matchTarget] || matchSource === 0) {
        console.log('failed');
        console.log(wordMatchSource);
        console.log(matchSource);
        console.log('pattern');
        console.log(pattern);
        console.log('target match');
        console.log(this.a.slice(matchedPatternIndex, matchedPatternIndex + PATTERN_LENGTH));
        console.log('matching words:');
        console.log(source[matchSource]);
        console.log(this.a[matchTarget]);
        return [null, null];
    }
    console.log('matches words:');
    console.log(source.slice(matchSource, matchSource + PATTERN_LENGTH));
    console.log(this.a.slice(matchTarget, matchTarget + PATTERN_LENGTH));
    return [ matchSource, matchTarget ];
  }

  // b is the source. Find the optimal operations to match it with target a.
  match(b: string[], from: number, to: number): {distance: number, matchIndices: number[]} {
    console.log('aligning snippet:');
    console.log([b.slice(0, 3), b.slice(b.length - 4, b.length - 1)]);
    console.log('aligning from to');
    console.log([from, to]);
    console.log([this.a.slice(from, from + 3), this.a.slice(to - 4, to - 1)]);
    if (to - from > 400 && b.length > this.chunkSize) {
        // divide and conquer.
        const [ sourcePivot, targetPivot ] = this.getPivots(b, from, to);
        const { distance: distance1, matchIndices: matchIndices1 } =
          this.match(b.slice(0, sourcePivot), from, targetPivot);
        const { distance: distance2, matchIndices: matchIndices2 } =
          this.match(b.slice(sourcePivot), targetPivot, to);

        const distance = distance1 + distance2;
        const matchIndices = matchIndices1.concat(matchIndices2);
        console.log('merged');
        console.log([from, to]);

        return { distance, matchIndices };
    }
    // matrix[i][j] is the weighted levenshtein distance of b[:i] and a[from:from+j]
    const matrix: number[][] = [];
    const ops: number[][] = [];
    const aslice = this.a.slice(from, to);
    // if (this.a.length === 0) return this.b.length;
    // if (this.b.length === 0) return this.a.length;

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [];
      ops[i] = [];
    }

    matrix[0][0] = 0;
    ops[0][0] = Op.Begin;
    for (let j = 1; j <= aslice.length; j++) {
      matrix[0][j] = matrix[0][j - 1] + this.insertionPenalty(aslice[j - 1], null);
      ops[0][j] = Op.Begin;
    }
    for (let i = 1; i <= b.length; i++) {
      matrix[i][0] = matrix[i - 1][0] + this.deletionPenalty(b[i - 1]);
      ops[i][0] = Op.Delete;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= aslice.length; j++) {
        const wordDistance = this.distance(b[i - 1], aslice[j - 1]);
        var substitution = matrix[i - 1][j - 1] + wordDistance;
        var insertion = matrix[i][j - 1] + this.insertionPenalty(aslice[j - 1], b[i - 1]);
        var deletion = matrix[i - 1][j] + this.deletionPenalty(b[i - 1]);
        if (substitution < insertion && substitution < deletion) {
          matrix[i][j] = substitution;
          if (wordDistance === 0) {
            ops[i][j] = Op.Match;
          } else {
            ops[i][j] = Op.Substitute;
          }
        }
        else if (insertion < deletion) {
          matrix[i][j] = insertion;
          ops[i][j] = Op.Insert;
        }
        else {
          matrix[i][j] = deletion;
          ops[i][j] = Op.Delete;
        }
      }
    }
    let i = b.length;
    let j = aslice.length;
    let op = ops[i][j];
    const matchIndices = new Array(b.length).fill(0);
    for (var c = 0; true; c++) {
        if (op === Op.Begin) {
            break;
        }
        if (i < 0 || j < 0) {
          break;
        }
        else if (op === Op.Substitute) {
            i = i - 1;
            j = j - 1;
        }
        else if (op === Op.Delete) {
            i = i - 1;
            j = j;
        }
        else if (op === Op.Insert) {
            i = i;
            j = j - 1;
        }
        else if (op === Op.Match) {
            i = i - 1;
            j = j - 1;
        }
        if (op !== Op.Insert) { // "if i changed"
            matchIndices[i] = from + Math.min(j, aslice.length - 1);
        }
        op = ops[i][j];
        // console.log(i + ' ' + j + ' ' + this.a[j] + ', ' + b[i] + ' ' + op);
    }
    /*
    console.log(aslice.join(' '));
    for (let i = 0; i < matrix.length; i += 1) {
        console.log(b.slice(0, i).join(' '));
        console.log(matrix[i].join(' '));
        console.log(ops[i].join(' '));
    }
    */
    return {
      distance: matrix[b.length][aslice.length],
      matchIndices,
    };
  }
}
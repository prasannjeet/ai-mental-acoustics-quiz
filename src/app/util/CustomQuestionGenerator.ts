import {Problem, ProblemData} from "./ProblemData";
import {QuestionSettings} from "./QuestionSettings";

export class CustomQuestionGenerator {
  private basicQuestionCount: number;
  private challengeQuestionCount: number;
  private questionSwapCount: number;
  private questionBatchCount: number;
  private batchFrequency: number;

  private basicQuestionIndex = 0;
  private challengeQuestionIndex = 0;

  private questionBatch: QuestionBatch;
  private batchCount: number = 0;

  constructor(
    private questionBankBasic: ProblemData,
    private questionBankChallenge: ProblemData,
    private settings: QuestionSettings
  ) {
    this.basicQuestionCount = settings.basicQuestionCount;
    this.challengeQuestionCount = settings.challengeQuestionCount;
    this.questionSwapCount = settings.questionSwapCount;
    this.questionBatchCount = this.basicQuestionCount + this.challengeQuestionCount;
    this.batchFrequency = settings.batchFrequency;
    this.questionBatch = new QuestionBatch(this.getQuestionBatch());
    this.batchCount++;
  }

  public nextQuestion(): Problem {
    try {
      return this.questionBatch.getNextBatchQuestion();
    } catch (e) {
      this.questionBatch = new QuestionBatch(this.prepareNextBatch());
      return this.questionBatch.getNextBatchQuestion();
    }
  }

  private prepareNextBatch(): Problem[] {
    this.batchCount++;
    if (this.batchCount % this.batchFrequency === 0) {
      if (this.basicQuestionCount > 0) {
        this.basicQuestionCount -= this.questionSwapCount;
        this.challengeQuestionCount += this.questionSwapCount;
      } else {
        this.challengeQuestionCount = this.questionBatchCount;
        this.basicQuestionCount = 0;
      }
    }
    return this.getQuestionBatch();
  }

  private getQuestionBatch(): Problem[] {
    let questionBatch: Problem[] = [];
    for (let i = 0; i < this.questionBatchCount; i++) {
      if (i < this.basicQuestionCount) {
        questionBatch.push(this.getNextBasicQuestion());
      } else {
        questionBatch.push(this.getNextChallengeQuestion());
      }
    }
    return questionBatch;
  }

  private getNextBasicQuestion(): Problem {
    return this.getItemAt(this.questionBankBasic, this.basicQuestionIndex++);
  }

  private getNextChallengeQuestion(): Problem {
    return this.getItemAt(this.questionBankChallenge, this.challengeQuestionIndex++);
  }

  private getItemAt(object: ProblemData, index: number): Problem {
    try {
      return Object.values(object)[index];
    } catch (e) {
      throw new Error("Index out of bounds");
    }
  }

}

class QuestionBatch {
  private questionBatch: Problem[] = [];
  private questionInBatchCounter: number = 0;

  constructor(qb: Problem[]) {
    this.questionBatch = qb;
  }

  public getNextBatchQuestion(): Problem {
    if (this.questionInBatchCounter < this.questionBatch.length) {
      return this.questionBatch[this.questionInBatchCounter++];
    } else {
      throw new Error("Index out of bounds");
    }
  }
}

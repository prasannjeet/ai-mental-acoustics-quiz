import {QuestionSettings} from "./QuestionSettings";
import {ProblemData} from "./ProblemData";
import {CustomQuestionGenerator} from "./CustomQuestionGenerator";

export class QuestionData {

  questionBank: ProblemData = {};
  questionBankBasic: ProblemData = {}; // object to hold the question bank
  questionBankChallenge: ProblemData = {}; // object to hold the question bank
  generator: CustomQuestionGenerator;

  constructor(data: any, settings: QuestionSettings) {
    this.questionBank = data;
    this.divideQuestionBank(this.questionBank);
    this.generator = new CustomQuestionGenerator(this.questionBankBasic, this.questionBankChallenge, settings);
  }

  public next() {
    return this.generator.nextQuestion();
  }

  private divideQuestionBank(qb: ProblemData) {
    let questionBankBasic: ProblemData = Object.keys(this.questionBank).reduce((obj:any, key) => {
      if (key.includes("basic")) {
        const newKey = key.replace("basic problem ", "");
        obj[newKey] = this.questionBank[key];
      }
      return obj;
    }, {});

    let questionBankChallenge: ProblemData = Object.keys(this.questionBank).reduce((obj:any, key) => {
      if (key.includes("challenge")) {
        const newKey = key.replace("challenge problem ", "");
        obj[newKey] = this.questionBank[key];
      }
      return obj;
    }, {});

    this.questionBankBasic = questionBankBasic;
    this.questionBankChallenge = questionBankChallenge;
  }

}

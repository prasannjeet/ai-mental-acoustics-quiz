export interface ProblemData {
  [key: string]: Problem
}

export interface Problem {
  questionName: string,
  questionType: string,
  questionSequence: string[],
  options: {
    [key: string]: string
  },
  answer: string
}

export interface AnswerData {
  [key: string]: Answer
}

export interface Answer {
  questionName: string,
  questionType: string,
  answer: string,
  chosenAnswer: string,
  startTimestamp: string,
  endTimestamp: string
}

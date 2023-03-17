export interface ProblemData {
  [key: string]: Problem
}

export interface Problem {
  questionSequence: string[],
  options: {
    [key: string]: string
  },
  answer: string
}

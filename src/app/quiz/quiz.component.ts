import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {QuestionSettings} from "../util/QuestionSettings";
import {QuestionData} from "../util/QuestionData";
import {interval, map, Observable, Subscription} from "rxjs";
import {Problem} from "../util/ProblemData";
import {NbOverlayService, NbToastrService} from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  millisecondValue: number = 0;


  questionData: QuestionData | undefined;
  theCurrentQuestion: Problem | undefined;
  currentQuestion: number = 0;

  qConfig: QuestionSettings = {
    basicQuestionCount : 5,
    challengeQuestionCount : 0,
    questionSwapCount : 1,
    batchFrequency : 1,
  }

  quizForm: FormGroup | undefined; // form to hold the selected option for the current question
  private correctAnswers: {[key: string]: string} = {};
  public selectedOption: string | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient, private toastrService: NbToastrService, private overlayService: NbOverlayService, private router: Router) {
    this.loadQuizData().subscribe((qd: QuestionData) => {
      this.questionData = qd;
      this.theCurrentQuestion = this.questionData.next();
    });
  }

  ngOnInit() {
    // initialize the form with an empty selectedOption
    this.quizForm = this.fb.group({
      selectedOption: ''
    });

    window.scrollTo(0, document.body.scrollHeight);
  }

  tick(): void {
    const theSelectedOption: string | undefined = this.selectedOption;
    const correctAnswer = this.theCurrentQuestion?.answer;
    this.nextQuestion();
    if (correctAnswer) {
      if (this.getFileNameWithoutExtension(theSelectedOption) == correctAnswer) {
        this.toastrService.success(
          `Correct!`,
          `Success`,
          { duration: 5000 }
        );
      } else {
        this.toastrService.danger(
          `Incorrect! Correct answer is ${correctAnswer}`,
          `Error`,
          { duration: 5000 }
        );
      }
    }

  }

  loadQuizData(): Observable<QuestionData> {
    return this.http.get<any>('/assets/assets.json').pipe(map((data: any) => {
      return new QuestionData(data, this.qConfig);
    }));
  }

  public getTheCurrentQuestionImages(): string[] | undefined {
    if (this.questionData) {
      return this.theCurrentQuestion?.questionSequence;
    }
    return undefined;
  }

  public getTheCurrentQuestionOptions(): string[] {
    if (this.theCurrentQuestion) {
      return Object.values(this.theCurrentQuestion.options);
    }
    return [];
  }

  public getTheCurrentQuestionTitle(): string | undefined {
    if (this.theCurrentQuestion) {
      return this.capitalizeFirstLetter(this.theCurrentQuestion.questionType) + " " + this.theCurrentQuestion.questionName;
    }
    return undefined;
  }

  public nextQuestion() {
    if (this.questionData) {
      this.theCurrentQuestion = this.questionData.next();
      this.currentQuestion++;
    }
  }

  selectOption(option: string) {
    // update the selectedOption variable with the option selected by the user
    this.selectedOption = option;
  }

  getFileNameWithoutExtension(filePath: string | undefined) {
    if (filePath) {
      const pathArray = filePath.split('/');
      const fileNameWithExtension = pathArray[pathArray.length - 1];
      const fileNameArray = fileNameWithExtension.split('.');
      return fileNameArray[0];
    }
    return 'Unknown Answer';
  }

  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['']);
    });
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}


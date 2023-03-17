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

  private readonly MAX_TIMER_VALUE = 10; // in seconds
  private readonly REFRESH_INTERVAL = 10; // in milliseconds
  private readonly TIMER_TICK_VALUE = 0.01; // in seconds
  timerValue: number = this.MAX_TIMER_VALUE;
  private subscription: Subscription | undefined;
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
    // Start the timer
    this.subscription = interval(this.REFRESH_INTERVAL).subscribe(() => {
      this.timerValue -= this.TIMER_TICK_VALUE;
      if (this.timerValue < 0) {
        this.timerValue = this.MAX_TIMER_VALUE;
        this.tick();
      }
    });
  }

  getStatus(): string {
    const timerPercentage = this.getProgressBarValue();

    if (timerPercentage > 75) {
      return 'primary';
    } else if (timerPercentage > 40) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  getProgressBarValue(): number {
    return Math.floor((this.timerValue / this.MAX_TIMER_VALUE) * 100);
  }

  getTimerValue(): string {
    // convert this.MAX_TIMER_VALUE to SS.sss format
    const seconds = Math.floor(this.timerValue);
    const milliseconds = Math.floor((this.timerValue - seconds) * 1000);
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const millisecondsString = milliseconds < 100 ? `0${milliseconds}` : `${milliseconds}`;
    return `${secondsString}.${millisecondsString}`;
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

  public nextQuestion() {
    if (this.questionData) {
      this.theCurrentQuestion = this.questionData.next();
      this.currentQuestion++;
    }
  }

  public resetQuiz() {
    console.log("resetting quiz");
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

  ngOnDestroy(): void {
    // unsubscribe from the timer
    this.subscription?.unsubscribe();
  }


}


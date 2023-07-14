import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {QuestionSettings} from "../util/QuestionSettings";
import {QuestionData} from "../util/QuestionData";
import {map, Observable, Subscription} from "rxjs";
import {Problem} from "../util/ProblemData";
import {NbOverlayService, NbToastrService} from '@nebular/theme';
import {Router} from '@angular/router';
import {NotificationService} from "../util/NotificationService";
import {KeycloakService} from "keycloak-angular";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  quizTime: number = environment.quizTimeSeconds;
  questionData: QuestionData | undefined;
  theCurrentQuestion: Problem | undefined;
  currentQuestion: number = 0;
  showQuestionPage: boolean = true;
  quizData: {
    question: Problem | undefined,
    answer: string | undefined,
    audioUrl: string | undefined,
    startTimestamp?: string | undefined,
    endTimestamp?: string | undefined
  }[] = [];
  startTimeStamp: string | undefined;
  endTimeStamp: string | undefined;
  totalQuestions: number = environment.totalQuestions; // Set this to the total number of questions you want
  userId: string | undefined;

  /**
   * 1. `basicQuestionCount`: This variable represents the number of basic questions that will be
   *    included in each batch of questions. The value is initially set from the `settings` object
   *    passed to the constructor and may be adjusted over time.
   *
   * 2. `challengeQuestionCount`: This variable represents the number of challenging questions that
   *    will be included in each batch of questions. Like `basicQuestionCount`, its initial value is
   *    set from the `settings` object and may be adjusted.
   *
   * 3. `questionSwapCount`: This variable represents the number of basic questions that will be
   *    replaced by challenging questions in each batch after a certain number of batches
   *    (determined by `batchFrequency`). Its value is set from the `settings` object.
   *
   * 4. `batchFrequency`: This variable determines how often the swap of basic questions for
   *    challenging questions occurs. For example, if `batchFrequency` is 3, then every third batch
   *    will have `questionSwapCount` more challenging questions and the same number fewer basic
   *    questions.
   *
   * 5. `questionBatchCount`: This variable represents the total number of questions in each batch,
   *    which is the sum of `basicQuestionCount` and `challengeQuestionCount`.
   *
   * The `CustomQuestionGenerator` class uses these variables to generate batches of questions, with
   * a mix of basic and challenging questions. Over time, the mix can shift to include more
   * challenging questions, based on the `questionSwapCount` and `batchFrequency` settings.
   */

  qConfig: QuestionSettings = {
    basicQuestionCount: 5,
    challengeQuestionCount: 0,
    questionSwapCount: 1,
    batchFrequency: 1,
  }

  quizForm: FormGroup | undefined; // form to hold the selected option for the current question
  public selectedOption: string | undefined;
  private subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastrService: NbToastrService,
    private overlayService: NbOverlayService,
    private router: Router,
    private notificationService: NotificationService,
    public keycloakService: KeycloakService,
    private ngZone: NgZone
  ) {
    this.userId = keycloakService.getKeycloakInstance().subject;
    this.loadQuizData().subscribe((qd: QuestionData) => {
      this.questionData = qd;
      this.theCurrentQuestion = this.questionData.next();
    });
    this.subscription = this.notificationService.onAudioRecorded.subscribe(event => this.handleAudioRecorded(event));
  }

  ngOnInit() {
    this.startTimeStamp = new Date().toISOString();
    // initialize the form with an empty selectedOption
    this.quizForm = this.fb.group({
      selectedOption: ''
    });

    window.scrollTo(0, document.body.scrollHeight);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async tick(): Promise<void> {
    const theSelectedOption: string | undefined = this.selectedOption;
    const correctAnswer = this.theCurrentQuestion?.answer;
    this.quizData.push(
      {
        question: this.theCurrentQuestion,
        answer: theSelectedOption,
        audioUrl: undefined,
        startTimestamp: this.startTimeStamp,
        endTimestamp: this.endTimeStamp
      });
    await this.nextQuestion();
    if (correctAnswer) {
      if (this.getFileNameWithoutExtension(theSelectedOption) == correctAnswer) {
        this.toastrService.success(
          `Correct!`,
          `Success`,
          {duration: 5000}
        );
      } else {
        this.toastrService.danger(
          `Incorrect! Correct answer is ${correctAnswer}`,
          `Error`,
          {duration: 5000}
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

  public async nextQuestion() {
    if (this.currentQuestion >= this.totalQuestions) {
      this.saveQuizData().subscribe(() => {
        this.toastrService.success('Quiz data saved successfully!', 'Success', {duration: 3000});
        this.ngZone.run(() => {
          setTimeout(() => {
            this.router.navigate(['/intro']);
          }, 3000);
        });
      }, (errorResponse) => {
        const errorMessage = errorResponse.error?.error || 'Unknown error';
        this.toastrService.danger(errorMessage, 'Error');
        console.error('Error saving quiz data: ', errorResponse.error);
        this.ngZone.run(() => {
          setTimeout(() => {
            this.router.navigate(['/intro']);
          }, 3000);
        });
      });
    } else if (this.questionData) {
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
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['']);
    });
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async displayNextQuestion() {
    this.showQuestionPage = true;
    await this.tick();
    this.startTimeStamp = new Date().toISOString();
  }

  handleAudioRecorded(event: { url: string }) {
    if (this.quizData.length > 0) {
      const lastEntry = this.quizData[this.quizData.length - 1];
      lastEntry.audioUrl = event.url;
    }
    // console.log('QuizData');
    // console.log(this.quizData);
  }


  displayRecordPage() {
    this.endTimeStamp = new Date().toISOString();
    this.showQuestionPage = false;
  }

  saveQuizData(): Observable<any> {
    const serverUrl = `${environment.appUrl}${environment.serverContextUrl}/users/${this.userId}/quiz`;
    return this.http.post(`${serverUrl}`, this.quizData);
  }

}


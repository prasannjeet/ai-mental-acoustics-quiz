import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IntroComponent} from "./intro/intro.component";
import {QuizComponent} from "./quiz/quiz.component";
import {RecordComponent} from "./record/record.component";
import { AuthGuard } from "./auth/auth.guard";
import {TermsComponent} from "./terms/terms.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'intro',
    pathMatch: "full"
  },
  {
    path: "intro",
    component: IntroComponent
  },
  {
    path: "quiz",
    component: QuizComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "record",
    component: RecordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "terms",
    component: TermsComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

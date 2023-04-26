import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IntroComponent} from "./intro/intro.component";
import {QuizComponent} from "./quiz/quiz.component";
import {RecordComponent} from "./record/record.component";

const routes: Routes = [
  {path:'', redirectTo:'intro',pathMatch:"full"},
  {path:"intro", component:IntroComponent},
  {path: "quiz", component:QuizComponent},
  {path: "record", component:RecordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

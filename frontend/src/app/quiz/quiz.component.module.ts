import { RouterModule } from "@angular/router"; // we also need angular router for Nebular to function properly
import {
  NbSidebarModule,
  NbLayoutModule,
  NbButtonModule,
  NbLayoutComponent,
  NbLayoutColumnComponent,
  NbSidebarComponent, NbMenuModule, NbThemeModule, NbIconModule, NbToastrService, NbOverlayService
} from "@nebular/theme";
import { NgModule } from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    RouterModule, // RouterModule.forRoot(routes, { useHash: true }), if this is your app.module
    NbLayoutModule,
    NbSidebarModule, // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
    NbMenuModule,
    NbThemeModule,
    NbIconModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [
    NbLayoutComponent,
    NbLayoutColumnComponent,
    NbSidebarComponent
  ],
  providers: [
    NbToastrService,
    NbOverlayService
    ],
})
export class QuizComponentModule {

}

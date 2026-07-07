import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { SurveyPageComponent } from './survey-page/survey-page.component';
import { StudentDetailsFormComponent } from './student-details-form/student-details-form/student-details-form.component';
import { ProfileComponent } from './profile/profile.component';
import { MessageDrawerComponent } from './message-drawer/message-drawer.component';
import { LoginRedirectComponentComponent } from './login-redirect-component/login-redirect-component.component';
import { LayoutComponent } from './layout/layout.component';
import { ChatComponent } from './chat/chat.component';
import { RoommateRequestsComponent } from './roommate-requests/roommate-requests.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { DormAdminPageComponent } from './dorm-admin-page/dorm-admin-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'student-details', component: StudentDetailsFormComponent },
  { path: 'login-redirect-component', component: LoginRedirectComponentComponent },
  { path: 'admin-page', component: AdminPageComponent },
  { path: 'dorm-admin-page', component: DormAdminPageComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'users', component: UsersPageComponent },
      { path: 'survey', component: SurveyPageComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'chat/:id', component: ChatComponent },
      { path: 'roommate-requests', component: RoommateRequestsComponent }
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

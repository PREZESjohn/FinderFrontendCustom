import {Routes} from '@angular/router';
import {HomePageComponent} from '../../../components/home-page/home-page.component';
import {DashboardComponent} from '../../../components/dashboard/dashboard.component';
import {AuthGuard} from '../../../services/AuthGuard';
import {LoginComponent} from '../../../components/login/login.component';
import {RegisterComponent} from '../../../components/register/register.component';
import {MyGroupsComponent} from '../../../components/my-groups/my-groups.component';
import {GroupAddComponent} from '../../../components/group-add/group-add.component';
import {UserProfileComponent} from '../../../components/user-profile/user-profile.component';
import {OtherUserProfileComponent} from '../../../components/other-user-profile/other-user-profile.component';
import {GroupShowComponent} from '../../../components/group-show/group-show.component';
import {ConfirmRegisterComponent} from '../../../components/verification/confirm-register/confirm-register.component';
import {ConfirmEmailChangeComponent} from '../../../components/verification/confirm-email-change/confirm-email-change.component';

export const UserLayoutRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'my-groups', component: MyGroupsComponent, canActivate: [AuthGuard]},
  {path: 'home-page', component: HomePageComponent, canActivate: [AuthGuard]},
  {path: 'group-add', component: GroupAddComponent, canActivate: [AuthGuard]},
  {path: 'confirmRegister', component: ConfirmRegisterComponent},
  {path: 'confirm-email-change', component: ConfirmEmailChangeComponent},
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/:id', component: OtherUserProfileComponent, canActivate: [AuthGuard]},
  {path: 'group-show/:id', component: GroupShowComponent, canActivate: [AuthGuard]}
]

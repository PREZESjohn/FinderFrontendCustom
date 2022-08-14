import {Routes} from '@angular/router';

import {DashboardComponent} from '../../components/dashboard/dashboard.component';
import {LoginComponent} from '../../components/login/login.component';
import {AuthGuard} from '../../services/AuthGuard';
import {RegisterComponent} from '../../components/register/register.component';
import {UserProfileComponent} from '../../components/user-profile/user-profile.component';
import {MyGroupsComponent} from '../../components/my-groups/my-groups.component';
import {GroupAddComponent} from '../../components/group-add/group-add.component';
import {GroupShowComponent} from '../../components/group-show/group-show.component';
import {OtherUserProfileComponent} from '../../components/other-user-profile/other-user-profile.component';
import {HomePageComponent} from '../../components/home-page/home-page.component';
import {AdminMainPageComponent} from '../../admin-components/admin-main-page/admin-main-page/admin-main-page.component';

export const AdminLayoutRoutes: Routes = [
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin-main-page', component: AdminMainPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'my-groups', component: MyGroupsComponent,canActivate:[AuthGuard] },
  // { path: 'home-page', component: HomePageComponent, canActivate:[AuthGuard] },
  // { path: 'group-add',component:GroupAddComponent, canActivate: [AuthGuard]},
  // { path: 'user-profile',component:UserProfileComponent, canActivate: [AuthGuard]},
  // { path: 'profile',component:OtherUserProfileComponent, canActivate: [AuthGuard]},
  // { path: 'group-show', component:GroupShowComponent,canActivate:[AuthGuard]}
];

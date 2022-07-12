import {Routes} from '@angular/router';

import {DashboardComponent} from '../../pages/dashboard/dashboard.component';
import {LoginComponent} from '../../components/login/login.component';
import {AuthGuard} from '../../services/AuthGuard';
import {RegisterComponent} from '../../components/register/register.component';
import {GroupRoomComponent} from '../../components/group-room/group-room.component';
import {UserProfileComponent} from '../../components/user-profile/user-profile.component';
import {MyGroupsComponent} from '../../components/my-groups/my-groups.component';
import {GroupAddComponent} from '../../components/group-add/group-add.component';
import {GroupShowComponent} from '../../components/group-show/group-show.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'my-groups', component: MyGroupsComponent,canActivate:[AuthGuard] },
  { path: 'group-room',component:GroupRoomComponent, canActivate: [AuthGuard]},
  { path: 'group-add',component:GroupAddComponent, canActivate: [AuthGuard]},
  { path: 'user-profile',component:UserProfileComponent, canActivate: [AuthGuard]},
  { path: 'group-show', component:GroupShowComponent,canActivate:[AuthGuard]}
];

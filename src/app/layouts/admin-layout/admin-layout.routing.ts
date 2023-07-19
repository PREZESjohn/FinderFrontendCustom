import {Routes} from '@angular/router';
import {LoginComponent} from '../../components/login/login.component';
import {RegisterComponent} from '../../components/register/register.component';
import {AdminMainPageComponent} from '../../admin-components/admin-main-page/admin-main-page/admin-main-page.component';
import {AdminGuard} from '../../services/AdminGuard';
import {ManageUsersComponent} from '../../admin-components/manage-users/manage-users.component';
import {SupportPanelComponent} from '../../admin-components/support-panel/support-panel.component';
import {GroupRoomDetailsComponent} from '../../admin-components/group-room-details/group-room-details.component';
import {UserDetailsComponent} from '../../admin-components/user-details/user-details.component';
import {ManageGamesComponent} from "../../admin-components/manage-games/manage-games.component";
import {GameDetailsComponent} from "../../admin-components/manage-games/game-details/game-details.component";
import {PageNotFoundComponent} from "../../components/page-not-found/page-not-found.component";

export const AdminLayoutRoutes: Routes = [
  { path: 'admin-main-page', component: AdminMainPageComponent, canActivate: [AdminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'manage-users', component: ManageUsersComponent, canActivate:[AdminGuard] },
  { path: 'manage-games', component: ManageGamesComponent, canActivate:[AdminGuard]},
  { path: 'group-room-details/:id', component: GroupRoomDetailsComponent, canActivate:[AdminGuard] },
  { path: 'user-details/:id', component: UserDetailsComponent, canActivate:[AdminGuard] },
  { path: 'support-panel', component: SupportPanelComponent, canActivate:[AdminGuard] },
  { path: 'game-details/:id', component: GameDetailsComponent, canActivate:[AdminGuard] },

  {path: "**",component: PageNotFoundComponent},
];

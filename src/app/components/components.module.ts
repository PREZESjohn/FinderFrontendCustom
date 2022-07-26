import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './register/register.component';
import {AlertComponent} from './alert/alert.component';
import { GroupRoomComponent } from './group-room/group-room.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { GroupShowComponent } from './group-show/group-show.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule, ReactiveFormsModule],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent, LoginComponent, RegisterComponent,
    AlertComponent, GroupRoomComponent, UserProfileComponent, GroupAddComponent,
    GroupEditComponent,
    MyGroupsComponent,
    GroupShowComponent,
    OtherUserProfileComponent],
    exports: [FooterComponent, NavbarComponent, SidebarComponent, AlertComponent]
})
export class ComponentsModule {
}

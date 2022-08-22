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
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GroupAddComponent } from './group-add/group-add.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { GroupShowComponent } from './group-show/group-show.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import {HomePageComponent} from './home-page/home-page.component';
import { ChatComponent } from './chat/chat.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    imports: [CommonModule, RouterModule, NgbModule, ReactiveFormsModule, MatGridListModule, MatSlideToggleModule, MatMenuModule, MatButtonModule, MatDialogModule],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent, LoginComponent, RegisterComponent,
    AlertComponent,  UserProfileComponent, GroupAddComponent,
    MyGroupsComponent,
    GroupShowComponent,HomePageComponent,
    OtherUserProfileComponent,
    ChatComponent],
    exports: [FooterComponent, NavbarComponent, SidebarComponent, AlertComponent, OtherUserProfileComponent]
})
export class ComponentsModule {
}

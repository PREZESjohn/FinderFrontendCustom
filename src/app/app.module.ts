import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import {TokenInterceptorService} from './services/token-interceptor.service';
import {BrowserModule} from '@angular/platform-browser';
import { UserLayoutComponent } from './layouts/user-layout/user-layout/user-layout.component';
import { AdminMainPageComponent } from './admin-components/admin-main-page/admin-main-page/admin-main-page.component';
import { AdminSidebarComponent } from './admin-components/admin-sidebar/admin-sidebar.component';
import { ManageUsersComponent } from './admin-components/manage-users/manage-users.component';
import { SupportPanelComponent } from './admin-components/support-panel/support-panel.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { GroupRoomDetailsComponent } from './admin-components/group-room-details/group-room-details.component';
import { UserDetailsComponent } from './admin-components/user-details/user-details.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { SearchUserDialogComponentComponent } from './admin-components/manage-users/search-user-dialog-component/search-user-dialog-component.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { BannedUsersComponent } from './admin-components/manage-users/banned-users/banned-users.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { UserChatLogsComponent } from './admin-components/user-details/user-chat-logs/user-chat-logs.component';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        FormsModule,
        HttpClientModule,
        ComponentsModule,
        NgbModule,
        RouterModule,
        AppRoutingModule,
        ToastrModule.forRoot(),
        MatTableModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatGridListModule,
        MatDialogModule,
        MatInputModule,
        MatIconModule,
        MatTabsModule,
        MatExpansionModule
    ],
  declarations: [AppComponent, AdminLayoutComponent, UserLayoutComponent, AdminMainPageComponent, AdminSidebarComponent, ManageUsersComponent, SupportPanelComponent, GroupRoomDetailsComponent, UserDetailsComponent, SearchUserDialogComponentComponent, BannedUsersComponent, UserChatLogsComponent],
  providers: [  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}

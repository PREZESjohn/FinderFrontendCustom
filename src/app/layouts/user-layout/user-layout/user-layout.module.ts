import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ComponentsModule} from '../../../components/components.module';
import {DashboardComponent} from '../../../components/dashboard/dashboard.component';
import {UserLayoutRoutes} from './user-layout.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  declarations: [
  ]
})
export class UserLayoutModule {}

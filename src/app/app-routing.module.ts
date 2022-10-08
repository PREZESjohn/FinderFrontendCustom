import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {AdminGuard} from './services/AdminGuard';
import {UserLayoutComponent} from './layouts/user-layout/user-layout/user-layout.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home-page',
    pathMatch: 'full'
  },


  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import ('./layouts/user-layout/user-layout/user-layout.module').then(m => m.UserLayoutModule),
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        loadChildren: () => import ('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation:'reload',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

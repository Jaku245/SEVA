import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'homePage'
  },
  {
    path: 'homePage',
    loadChildren: () => import('./home-page/home-page.module').then( m => m.HomePagePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./my-profile-page/my-profile-page.module').then( m => m.MyProfilePagePageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help-page/help-page.module').then( m => m.HelpPagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}

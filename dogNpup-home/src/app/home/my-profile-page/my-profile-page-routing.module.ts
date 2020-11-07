import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfilePagePage } from './my-profile-page.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfilePagePage
  },
  {
    path: 'reset/:userId',
    loadChildren: () => import('../my-Profile-Page/reset-password-page/reset-password-page.module')
    .then( m => m.ResetPasswordPagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfilePagePageRoutingModule {}

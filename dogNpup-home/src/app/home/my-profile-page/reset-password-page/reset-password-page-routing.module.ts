import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordPagePage } from './reset-password-page.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordPagePageRoutingModule {}

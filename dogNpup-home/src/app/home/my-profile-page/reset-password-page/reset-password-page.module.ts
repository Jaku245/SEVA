import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordPagePageRoutingModule } from './reset-password-page-routing.module';

import { ResetPasswordPagePage } from './reset-password-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPasswordPagePageRoutingModule
  ],
  declarations: [ResetPasswordPagePage]
})
export class ResetPasswordPagePageModule {}

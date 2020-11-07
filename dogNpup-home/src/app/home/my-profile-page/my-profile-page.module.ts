import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfilePagePageRoutingModule } from './my-profile-page-routing.module';

import { MyProfilePagePage } from './my-profile-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfilePagePageRoutingModule
  ],
  declarations: [MyProfilePagePage]
})
export class MyProfilePagePageModule {}

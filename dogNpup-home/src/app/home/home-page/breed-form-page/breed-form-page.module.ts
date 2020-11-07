import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BreedFormPagePageRoutingModule } from './breed-form-page-routing.module';

import { BreedFormPagePage } from './breed-form-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BreedFormPagePageRoutingModule
  ],
  declarations: [BreedFormPagePage]
})
export class BreedFormPagePageModule {}

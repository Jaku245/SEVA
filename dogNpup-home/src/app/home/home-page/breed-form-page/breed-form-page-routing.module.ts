import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreedFormPagePage } from './breed-form-page.page';

const routes: Routes = [
  {
    path: '',
    component: BreedFormPagePage
  },
  {
    path: ':breedId',
    component: BreedFormPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreedFormPagePageRoutingModule {}

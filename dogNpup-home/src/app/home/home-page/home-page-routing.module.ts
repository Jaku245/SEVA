import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePagePage } from './home-page.page';

const routes: Routes = [
  {
    path: '',
    component: HomePagePage
  },
  {
    path: 'breedForm',
    loadChildren: () => import('../home-Page/breed-form-page/breed-form-page.module').then( m => m.BreedFormPagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePagePageRoutingModule {}

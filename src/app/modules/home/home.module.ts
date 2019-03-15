import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { HomeComponent } from './home.component';

const routes: Routes = <Routes>[{
  path: '',
  component: HomeComponent,
  data: {
    redirectUrl: null,
  },
}];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [
    HomeComponent,
  ],
})
export class HomeModule { }



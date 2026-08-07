import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaisList } from './pais-list/pais-list';

const routes: Routes = [
  {
    path: '',
    component: PaisList
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaisRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CidadeList } from './cidade-list/cidade-list';

const routes: Routes = [
  {
    path: '',
    component: CidadeList
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CidadeRoutingModule {}
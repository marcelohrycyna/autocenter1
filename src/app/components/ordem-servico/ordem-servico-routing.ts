import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdemServicoList } from './ordem-servico-list/ordem-servico-list';

const routes: Routes = [
  {
    path: '',
    component: OrdemServicoList
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdemServicoRouting {}

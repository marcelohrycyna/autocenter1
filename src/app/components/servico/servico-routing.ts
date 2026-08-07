import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ServicoList } from './servico-list/servico-list';

const routes: Routes = [
  {
    path: '',
    component: ServicoList
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicoRouting {}
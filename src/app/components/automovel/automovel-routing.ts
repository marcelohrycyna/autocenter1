import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AutomovelList } from './automovel-list/automovel-list';

const routes: Routes = [
  {
    path: '',
    component: AutomovelList
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomovelRoutingModule {}

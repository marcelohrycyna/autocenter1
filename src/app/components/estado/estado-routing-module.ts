import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EstadoList } from './estado-list/estado-list';

const routes: Routes = [
  {
    path: '',
    component: EstadoList
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoRoutingModule {}

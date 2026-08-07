import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClienteList } from './cliente-list/cliente-list';

const routes: Routes = [
  {
    path: '',
    component: ClienteList
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRouting {}
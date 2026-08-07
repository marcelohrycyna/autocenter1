import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CidadeCreate } from './cidade-create/cidade-create';
import { CidadeList } from './cidade-list/cidade-list';
import { CidadeEdit } from './cidade-edit/cidade-edit';
import { CidadeRoutingModule } from './cidade-routing-module';

@NgModule({
  imports: [
    CommonModule,
    CidadeRoutingModule,
    CidadeCreate,
    CidadeList,
    CidadeEdit
  ]
})
export class CidadeModule {}

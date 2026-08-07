import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomovelCreate } from './automovel-create/automovel-create';
import { AutomovelList } from './automovel-list/automovel-list';
import { AutomovelEdit } from './automovel-edit/automovel-edit';
import { AutomovelRoutingModule } from './automovel-routing';

@NgModule({
  imports: [
    CommonModule,
    AutomovelRoutingModule,
    AutomovelCreate,
    AutomovelList,
    AutomovelEdit
  ]
})
export class AutomovelModule {}

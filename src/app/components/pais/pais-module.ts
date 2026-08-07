import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaisCreate } from './pais-create/pais-create';
import { PaisList } from './pais-list/pais-list';
import { PaisEdit } from './pais-edit/pais-edit';
import { PaisRoutingModule } from './pais-routing-module';

@NgModule({
  imports: [CommonModule, PaisRoutingModule, PaisCreate, PaisList, PaisEdit],
})
export class PaisModule {}

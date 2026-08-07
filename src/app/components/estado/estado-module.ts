import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoCreate } from './estado-create/estado-create';
import { EstadoList } from './estado-list/estado-list';
import { EstadoEdit } from './estado-edit/estado-edit';
import { EstadoRoutingModule } from './estado-routing-module';

@NgModule({
  imports: [CommonModule, EstadoRoutingModule, EstadoCreate, EstadoList, EstadoEdit],
})
export class EstadoModule {}

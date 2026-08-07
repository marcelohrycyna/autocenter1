import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdemServicoRouting } from './ordem-servico-routing';
import { OrdemServicoCreate } from './ordem-servico-create/ordem-servico-create';
import { OrdemServicoList } from './ordem-servico-list/ordem-servico-list';
import { OrdemServicoEdit } from './ordem-servico-edit/ordem-servico-edit';

@NgModule({
  declarations: [],
  imports: [CommonModule, OrdemServicoRouting, OrdemServicoCreate, OrdemServicoList, OrdemServicoEdit],
})
export class OrdemServicoModule {}
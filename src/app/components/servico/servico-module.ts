import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicoCreate } from './servico-create/servico-create';
import { ServicoRouting } from './servico-routing';
import { ServicoList } from './servico-list/servico-list';
import { ServicoEdit } from './servico-edit/servico-edit';


@NgModule({
  imports: [CommonModule, ServicoRouting, ServicoCreate, ServicoList, ServicoEdit],
})
export class ServicoModule {}

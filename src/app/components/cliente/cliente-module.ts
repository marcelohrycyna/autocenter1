import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteCreate } from './cliente-create/cliente-create';
import { ClienteList } from './cliente-list/cliente-list';
import { ClienteEdit } from './cliente-edit/cliente-edit';
import { ClienteRouting } from './cliente-routing';

@NgModule({
  imports: [CommonModule, ClienteCreate, ClienteRouting, ClienteList, ClienteEdit],
})
export class ClienteModule {}
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClienteCreate } from '../cliente-create/cliente-create';
import { MatDialog } from '@angular/material/dialog';
import { ClienteEdit } from '../cliente-edit/cliente-edit';
import { forkJoin } from 'rxjs';
import { CrudService } from '../../crud.service';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AutomovelCreate } from '../../automovel/automovel-create/automovel-create';
import { AutomovelListModal } from '../../automovel-list-modal/automovel-list-modal';


@Component({
  selector: 'app-cliente-list',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatTableModule, MatListModule, MatInputModule, MatButtonModule, MatCheckboxModule, NgxMaskPipe],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'id', 'nome', 'cpf', 'telefone', 'editar'];
  clientes: any[] = [];
  selectedIds: Array<string | number> = [];
  resource: string = 'clientes';
  constructor(private readonly crudService : CrudService, public dialog: MatDialog){}

  ngOnInit(): void{
    this.getClientes();
  }
  openDialogCreate(): void {
    const dialogRef = this.dialog.open(ClienteCreate, {});

    dialogRef.afterClosed().subscribe(() => {
      this.getClientes();
    });
  }

  openDialogEdit(id: string): void {
    const dialogRef = this.dialog.open(ClienteEdit, {
      data: id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getClientes();
    });
  }

   public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelection(cliente: any): void {
    const id = cliente.id;
    this.selectedIds = this.selectedIds.includes(id)
      ? this.selectedIds.filter((item) => item !== id)
      : [...this.selectedIds, id];
  }

  isSelected(cliente: any): boolean {
    return this.selectedIds.includes(cliente.id);
  }

  isAllSelected(): boolean {
    return this.clientes.length > 0 && this.selectedIds.length === this.clientes.length;
  }

  toggleSelectAll(): void {
    this.selectedIds = this.isAllSelected() ? [] : this.clientes.map((cliente) => cliente.id);
  }

  deletarSelecionados(): void {
    if (!this.selectedIds.length) {
      return;
    }

    const requests = this.selectedIds.map((id) => this.crudService.delete(String(id), this.resource));

    forkJoin(requests).subscribe({
      next: () => {
        this.selectedIds = [];
        this.crudService.showMessage(
              'Exclusão bem-sucedida!', 
              false
            );
        this.getClientes();
      },
      error: (err: any) => {
        console.error('Erro ao excluir clientes selecionados:', err);
      }
    });
  }

  getClientes(): void {
    this.crudService.getAll(this.resource).subscribe({
      next: (retorno: any[]) => {
        this.clientes = retorno ?? [];
        this.dataSource.data = this.clientes;
      },
      error: (err: any) => {
        console.error('Erro ao buscar clientes:', err);
      }
    });
  }

  openExibirAutomoveisDoCliente(): void {
    if (this.selectedIds.length > 0) {
      const clienteId = String(this.selectedIds[0]);
      const clienteCompleto = this.dataSource.data.find(c => String(c.id) === clienteId);
      const dialogRef = this.dialog.open(AutomovelListModal, {data: { cliente: clienteCompleto }});

      dialogRef.afterClosed().subscribe(() => {
      this.getClientes();
      }
    )}    
  }
}
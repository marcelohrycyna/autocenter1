import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CrudService } from '../crud.service';
import { AutomovelEdit } from '../automovel/automovel-edit/automovel-edit';
import { AutomovelCreate } from '../automovel/automovel-create/automovel-create';

@Component({
  selector: 'app-automovel-list-modal',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatTableModule, MatListModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './automovel-list-modal.html',
  styleUrl: './automovel-list-modal.css',
})
export class AutomovelListModal implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'id', 'modelo', 'placa', 'editar'];
  automoveis: any[] = [];
  selectedIds: Array<string | number> = [];
  resource: string = 'automoveis';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cliente: any },
    private readonly crudService: CrudService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAutomoveis();
  }

  openDialogEdit(id: string): void {
    const dialogRef = this.dialog.open(AutomovelEdit, {
      data: id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAutomoveis();
    });
  }

  openDialogCreateAutomovel(): void {
    const clienteCompleto = this.data.cliente;
    console.log('clientecompleto', clienteCompleto);
    const dialogRef = this.dialog.open(AutomovelCreate, { data: { cliente: clienteCompleto } });

    dialogRef.afterClosed().subscribe(() => {
      this.getAutomoveis();
    });

  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelection(automovel: any): void {
    const id = automovel.id;
    this.selectedIds = this.selectedIds.includes(id)
      ? this.selectedIds.filter((item) => item !== id)
      : [...this.selectedIds, id];
  }

  isSelected(automovel: any): boolean {
    return this.selectedIds.includes(automovel.id);
  }

  isAllSelected(): boolean {
    return this.automoveis.length > 0 && this.selectedIds.length === this.automoveis.length;
  }

  toggleSelectAll(): void {
    this.selectedIds = this.isAllSelected() ? [] : this.automoveis.map((automovel) => automovel.id);
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
        this.getAutomoveis();
      },
      error: (err: any) => {
        console.error('Erro ao excluir automoveis selecionados:', err);
      }
    });
  }

  getAutomoveis(): void {
    const idDoCliente = this.data.cliente?.id;

    if (this.data && this.data.cliente?.id) {
      this.crudService.getByClienteId(this.resource, idDoCliente).subscribe({
        next: (retorno: any[]) => {
          this.automoveis = retorno ?? [];
          this.dataSource.data = this.automoveis;
        },
        error: (err: any) => {
          console.error('Erro ao buscar automoveis:', err);
        }
      });
    } else {
      this.crudService.getAll(this.resource).subscribe({
        next: (retorno: any[]) => {
          this.automoveis = retorno ?? [];
          this.dataSource.data = this.automoveis;
        },
        error: (err: any) => {
          console.error('Erro ao buscar automoveis:', err);
        }
      });
    }
  }
}
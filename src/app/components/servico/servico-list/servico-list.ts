import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ServicoCreate } from '../servico-create/servico-create';
import { MatDialog } from '@angular/material/dialog';
import { ServicoEdit } from '../servico-edit/servico-edit';
import { forkJoin } from 'rxjs';
import { CrudService } from '../../crud.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-servico-list',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatTableModule, MatListModule, MatInputModule, MatButtonModule, MatCheckboxModule, CurrencyPipe],
  templateUrl: './servico-list.html',
  styleUrl: './servico-list.css',
})
export class ServicoList implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'id', 'tipo', 'valor', 'editar'];
  servicos: any[] = [];
  selectedIds: Array<string | number> = [];
  resource: string = 'servicos';
  constructor(private readonly crudService : CrudService, public dialog: MatDialog){}

  ngOnInit(): void{
    this.getServicos();
  }
  openDialogCreate(): void {
    const dialogRef = this.dialog.open(ServicoCreate, {});

    dialogRef.afterClosed().subscribe(() => {
      this.getServicos();
    });
  }

  openDialogEdit(id: string): void {
    const dialogRef = this.dialog.open(ServicoEdit, {
      data: id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getServicos();
    });
  }

   public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelection(servico: any): void {
    const id = servico.id;
    this.selectedIds = this.selectedIds.includes(id)
      ? this.selectedIds.filter((item) => item !== id)
      : [...this.selectedIds, id];
  }

  isSelected(servico: any): boolean {
    return this.selectedIds.includes(servico.id);
  }

  isAllSelected(): boolean {
    return this.servicos.length > 0 && this.selectedIds.length === this.servicos.length;
  }

  toggleSelectAll(): void {
    this.selectedIds = this.isAllSelected() ? [] : this.servicos.map((servico) => servico.id);
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
        this.getServicos();
      },
      error: (err: any) => {
        console.error('Erro ao excluir serviços selecionados:', err);
      }
    });
  }

  getServicos(): void {
    this.crudService.getAll(this.resource).subscribe({
      next: (retorno: any[]) => {
        this.servicos = retorno ?? [];
        this.dataSource.data = this.servicos;
      },
      error: (err: any) => {
        console.error('Erro ao buscar serviços:', err);
      }
    });
  }
}
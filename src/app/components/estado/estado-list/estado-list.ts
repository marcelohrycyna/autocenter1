import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EstadoCreate } from '../estado-create/estado-create';
import { MatDialog } from '@angular/material/dialog';
import { EstadoEdit } from '../estado-edit/estado-edit';
import { forkJoin } from 'rxjs';
import { CrudService } from '../../crud.service';

@Component({
  selector: 'app-estado-list',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatTableModule, MatListModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './estado-list.html',
  styleUrl: './estado-list.css',
})
export class EstadoList implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'id', 'nome', 'sigla', 'pais_nome', 'editar'];
  estados: any[] = [];
  selectedIds: Array<string | number> = [];
  resource: string = 'estados';
  constructor(private readonly crudService : CrudService, public dialog: MatDialog){}

  ngOnInit(): void{
    this.getEstados();
  }
  openDialogCreate(): void {
    const dialogRef = this.dialog.open(EstadoCreate, {});

    dialogRef.afterClosed().subscribe(() => {
      this.getEstados();
    });
  }

  openDialogEdit(id: string): void {
    const dialogRef = this.dialog.open(EstadoEdit, {
      data: id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getEstados();
    });
  }

   public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelection(estado: any): void {
    const id = estado.id;
    this.selectedIds = this.selectedIds.includes(id)
      ? this.selectedIds.filter((item) => item !== id)
      : [...this.selectedIds, id];
  }

  isSelected(estado: any): boolean {
    return this.selectedIds.includes(estado.id);
  }

  isAllSelected(): boolean {
    return this.estados.length > 0 && this.selectedIds.length === this.estados.length;
  }

  toggleSelectAll(): void {
    this.selectedIds = this.isAllSelected() ? [] : this.estados.map((estado) => estado.id);
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
        this.getEstados();
      },
      error: (err: any) => {
        console.error('Erro ao excluir estados selecionados:', err);
      }
    });
  }

  getEstados(): void {
    this.crudService.getAll(this.resource).subscribe({
      next: (retorno: any[]) => {
        this.estados = retorno ?? [];
        this.dataSource.data = this.estados;
      },
      error: (err: any) => {
        console.error('Erro ao buscar estados:', err);
      }
    });
  }
}
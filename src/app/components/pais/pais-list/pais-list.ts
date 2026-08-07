import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaisCreate } from '../pais-create/pais-create';
import { MatDialog } from '@angular/material/dialog';
import { PaisEdit } from '../pais-edit/pais-edit';
import { forkJoin } from 'rxjs';
import { CrudService } from '../../crud.service';

@Component({
  selector: 'app-pais-list',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatTableModule, MatListModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './pais-list.html',
  styleUrl: './pais-list.css',
})
export class PaisList implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'id', 'nome', 'sigla', 'editar'];
  paises: any[] = [];
  selectedIds: Array<string | number> = [];
  resource: string = 'paises';
  constructor(private readonly crudService : CrudService, public dialog: MatDialog){}

  ngOnInit(): void{
    this.getPaises();
  }
  openDialogCreate(): void {
    const dialogRef = this.dialog.open(PaisCreate, {});

    dialogRef.afterClosed().subscribe(() => {
      this.getPaises();
    });
  }

  openDialogEdit(id: string): void {
    const dialogRef = this.dialog.open(PaisEdit, {
      data: id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getPaises();
    });
  }

   public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelection(pais: any): void {
    const id = pais.id;
    this.selectedIds = this.selectedIds.includes(id)
      ? this.selectedIds.filter((item) => item !== id)
      : [...this.selectedIds, id];
  }

  isSelected(pais: any): boolean {
    return this.selectedIds.includes(pais.id);
  }

  isAllSelected(): boolean {
    return this.paises.length > 0 && this.selectedIds.length === this.paises.length;
  }

  toggleSelectAll(): void {
    this.selectedIds = this.isAllSelected() ? [] : this.paises.map((pais) => pais.id);
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
        this.getPaises();
      },
      error: (err: any) => {
        console.error('Erro ao excluir países selecionados:', err);
      }
    });
  }

  getPaises(): void {
    this.crudService.getAll(this.resource).subscribe({
      next: (retorno: any[]) => {
        this.paises = retorno ?? [];
        this.dataSource.data = this.paises;
      },
      error: (err: any) => {
        console.error('Erro ao buscar países:', err);
      }
    });
  }
}
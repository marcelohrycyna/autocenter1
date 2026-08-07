import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CidadeCreate } from '../cidade-create/cidade-create';
import { MatDialog } from '@angular/material/dialog';
import { CidadeEdit } from '../cidade-edit/cidade-edit';
import { forkJoin } from 'rxjs';
import { CrudService } from '../../crud.service';

@Component({
  selector: 'app-cidade-list',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatTableModule, MatListModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './cidade-list.html',
  styleUrl: './cidade-list.css',
})
export class CidadeList implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'id', 'nome', 'estado_nome', 'pais_nome', 'editar'];
  cidades: any[] = [];
  selectedIds: Array<string | number> = [];
  resource: string = 'cidades';
  constructor(private readonly crudService : CrudService, public dialog: MatDialog){}

  ngOnInit(): void{
    this.getCidades();
  }
  openDialogCreate(): void {
    const dialogRef = this.dialog.open(CidadeCreate, {});

    dialogRef.afterClosed().subscribe(() => {
      this.getCidades();
    });
  }

  openDialogEdit(id: string): void {
    const dialogRef = this.dialog.open(CidadeEdit, {
      data: id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCidades();
    });
  }

   public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelection(cidade: any): void {
    const id = cidade.id;
    this.selectedIds = this.selectedIds.includes(id)
      ? this.selectedIds.filter((item) => item !== id)
      : [...this.selectedIds, id];
  }

  isSelected(cidade: any): boolean {
    return this.selectedIds.includes(cidade.id);
  }

  isAllSelected(): boolean {
    return this.cidades.length > 0 && this.selectedIds.length === this.cidades.length;
  }

  toggleSelectAll(): void {
    this.selectedIds = this.isAllSelected() ? [] : this.cidades.map((cidade) => cidade.id);
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
        this.getCidades();
      },
      error: (err: any) => {
        console.error('Erro ao excluir cidades selecionadas:', err);
      }
    });
  }

  getCidades(): void {
    this.crudService.getAll(this.resource).subscribe({
      next: (retorno: any[]) => {
        this.cidades = retorno ?? [];
        this.dataSource.data = this.cidades;
      },
      error: (err: any) => {
        console.error('Erro ao buscar cidades:', err);
      }
    });
  }
}
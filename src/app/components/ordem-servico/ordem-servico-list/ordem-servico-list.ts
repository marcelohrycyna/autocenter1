import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CrudService } from '../../crud.service';
import { DatePipe } from '@angular/common';
import { NgClass } from '@angular/common'
import { OrdemServicoCreate } from '../ordem-servico-create/ordem-servico-create';
import { OrdemServicoEdit } from '../ordem-servico-edit/ordem-servico-edit';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-ordem-servico-list',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatTableModule, MatListModule, MatInputModule, MatButtonModule, MatSelectModule, MatCheckboxModule, NgClass, DatePipe],
  templateUrl: './ordem-servico-list.html',
  styleUrl: './ordem-servico-list.css',
})
export class OrdemServicoList implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['select', 'id', 'data_entrada', 'data_saida', 'fechado', 'cliente_nome', 'editar'];
  oss: any[] = [];
  selectedIds: Array<string | number> = [];
  resource: string = 'ordemservicos';
  constructor(private readonly crudService : CrudService, public dialog: MatDialog){}

  ngOnInit(): void{
    this.configurarFiltro();
  }
  openDialogCreate(): void {
    const dialogRef = this.dialog.open(OrdemServicoCreate, {});

    dialogRef.afterClosed().subscribe(() => {
      this.getOrdemServicos();
    });
  }

  openDialogEdit(id: string): void {
    const dialogRef = this.dialog.open(OrdemServicoEdit, {
      data: id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getOrdemServicos();
    });
  }

  private configurarFiltro(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // Pega os valores diretos da Ordem de Serviço
      const valoresOS = Object.keys(data)
        .filter((key) => typeof data[key] !== 'object' && data[key] !== null && data[key] !== undefined)
        .map((key) => data[key])
        .join(' ');

      // Pega TODOS os valores dentro do objeto cliente
      const valoresCliente = data.cliente
        ? Object.values(data.cliente)
            .filter((val) => val !== null && val !== undefined)
            .join(' ')
        : '';

      // Junta tudo em uma única string em caixa baixa para comparação
      const textoBusca = `${valoresOS} ${valoresCliente}`.toLowerCase();

      return textoBusca.includes(filter);
    };
  }

   public applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelection(os: any): void {
    const id = os.id;
    this.selectedIds = this.selectedIds.includes(id)
      ? this.selectedIds.filter((item) => item !== id)
      : [...this.selectedIds, id];
  }

  isSelected(os: any): boolean {
    return this.selectedIds.includes(os.id);
  }

  isAllSelected(): boolean {
    return this.oss.length > 0 && this.selectedIds.length === this.oss.length;
  }

  toggleSelectAll(): void {
    this.selectedIds = this.isAllSelected() ? [] : this.oss.map((os) => os.id);
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
        this.getOrdemServicos();
      },
      error: (err: any) => {
        console.error('Erro ao excluir as Ordens de Serviço selecionadas:', err);
      }
    });
  }

  getOrdemServicos(): void {
    this.crudService.getAll(this.resource).subscribe({
      next: (retorno: any[]) => {
        this.oss = retorno ?? [];
        this.dataSource.data = this.oss;
      },
      error: (err: any) => {
        console.error('Erro ao buscar as Ordens de Serviço:', err);
      }
    });
  }

  onPesquisarPorChange(status :string) :void {
    let rotaStatus = '/status'; 

    if (status === 'fechado') {
        rotaStatus = '/status/true';
    } else if (status === 'aberto') {
        rotaStatus = '/status/false';
    }
    this.crudService.getPersonalizado(this.resource, rotaStatus).subscribe({
      next: (retorno: any[]) => {
        this.oss = retorno ?? [];
        this.dataSource.data = this.oss;
      },
      error: (err: any) => {
        console.error('Erro ao buscar as Ordens de Serviço:', err);
      }
    });
  }
}
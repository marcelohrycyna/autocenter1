import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { CrudService } from '../../crud.service';

@Component({
  selector: 'app-cidade-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './cidade-edit.html',
  styleUrl: './cidade-edit.css',
})
export class CidadeEdit implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataId: any,
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<CidadeEdit>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formCidade: UntypedFormGroup;
  resource : string = 'cidades';
  estados: any[] = [];

  ngOnInit(): void {
    this.formCidade = this.fb.group({
      id: [this.dataId, [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      estadoId: ['', [Validators.required]]
    });
    this.getCidade();
    this.getEstados();
  }

  getCidade(): void {
    this.crudService.getById(this.dataId, this.resource).subscribe({
      next: (retorno: any) => {
        const cidade = retorno?.data ?? retorno;

        if (cidade) {
          this.PreencherFormGroup(cidade);
        } else {
          console.error('Resposta inesperada ao buscar a cidade:', retorno);
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar a cidade:', err);
      }
    });
  }

  getEstados(): void {
    this.crudService.getAll('estados').subscribe({
      next: (retorno: any) => {
        this.estados = retorno?.data ?? retorno;
      },
      error: (err: any) => {
        console.error('Erro ao buscar os estados:', err);
      }
    });
  }

  update(){
    if (this.formCidade.valid) {
      try{
        this.crudService.update(this.dataId, this.formCidade.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Cidade atualizada com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao atualizar cidade:', err),
        });
      } catch (err: unknown) {
        this.crudService.showMessage(`Erro: ${err}`, true);
        this.router.navigate(['/estados']);
      }
    }
  }

  public cancel(): void{
    window.history.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formCidade.controls[controlName].hasError(errorName);
  }

  private PreencherFormGroup(obj: any): void {
    const cidade = obj ?? {};

    this.formCidade.patchValue({
      id: cidade.id ?? this.dataId,
      nome: cidade.nome ?? '',
      estadoId: cidade.estadoId ?? ''
    });
  }
}
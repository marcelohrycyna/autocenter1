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
  selector: 'app-estado-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './estado-edit.html',
  styleUrl: './estado-edit.css',
})
export class EstadoEdit implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataId: any,
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<EstadoEdit>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formEstado: UntypedFormGroup;
  resource : string = 'estados';
  paises: any[] = [];

  ngOnInit(): void {
    this.formEstado = this.fb.group({
      id: [this.dataId, [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      sigla: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      paisId: ['', [Validators.required]]
    });
    this.getEstado();
    this.getPaises();
  }

  getEstado(): void {
    this.crudService.getById(this.dataId, this.resource).subscribe({
      next: (retorno: any) => {
        const estado = retorno?.data ?? retorno;

        if (estado) {
          this.PreencherFormGroup(estado);
        } else {
          console.error('Resposta inesperada ao buscar o estado:', retorno);
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar o estado:', err);
      }
    });
  }

  getPaises(): void {
    this.crudService.getAll('paises').subscribe({
      next: (retorno: any) => {
        this.paises = retorno?.data ?? retorno;
        console.log('getPaises - paises:', this.paises);
      },
      error: (err: any) => {
        console.error('Erro ao buscar os paises:', err);
      }
    });
  }

  update(){
    if (this.formEstado.valid) {
      try{
        this.crudService.update(this.dataId, this.formEstado.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Estado atualizado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao atualizar estado:', err),
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
    return this.formEstado.controls[controlName].hasError(errorName);
  }

  private PreencherFormGroup(obj: any): void {
    const estado = obj ?? {};

    this.formEstado.patchValue({
      id: estado.id ?? this.dataId,
      nome: estado.nome ?? '',
      sigla: estado.sigla ?? '',
      paisId: estado.paisId ?? ''
    });
  }
}
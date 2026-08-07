import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CrudService } from '../../crud.service';

@Component({
  selector: 'app-pais-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './pais-edit.html',
  styleUrl: './pais-edit.css',
})
export class PaisEdit implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataId: any,
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<PaisEdit>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formPais: UntypedFormGroup;
  resource : string = 'paises';

  ngOnInit(): void {
    this.formPais = this.fb.group({
      id: [this.dataId, [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      sigla: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
    });
    this.getPaises();
  }

  getPaises(): void {
    this.crudService.getById(this.dataId, this.resource).subscribe({
      next: (retorno: any) => {
        const pais = retorno?.data ?? retorno;

        if (pais) {
          this.PreencherFormGroup(pais);
        } else {
          console.error('Resposta inesperada ao buscar o país:', retorno);
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar o país:', err);
      }
    });
  }

  update(){
    if (this.formPais.valid) {
      try{
        this.crudService.update(this.dataId, this.formPais.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'País atualizado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao atualizar país:', err),
        });
      }catch (err: unknown) {
        this.crudService.showMessage('Error ${err}', true);
        this.router.navigate(['/paises']);
      }
    }
  }

  

  public cancel(): void{
    window.history.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formPais.controls[controlName].hasError(errorName);
  }

  private PreencherFormGroup(obj: any): void {
    const pais = obj ?? {};

    this.formPais.patchValue({
      id: pais.id ?? this.dataId,
      nome: pais.nome ?? '',
      sigla: pais.sigla ?? ''
    });
  }
}
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CrudService } from '../../crud.service';

@Component({
  selector: 'app-pais-create',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './pais-create.html',
  styleUrl: './pais-create.css',
})
export class PaisCreate implements OnInit {
  constructor(private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<PaisCreate>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formPais: UntypedFormGroup;
  resource : string = 'paises';

  ngOnInit(): void {
    this.formPais = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      sigla: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
    });
  }

  criar(){
    if (this.formPais.valid) {
      try{
        this.crudService.create(this.formPais.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'País criado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao criar país:', err),
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
}
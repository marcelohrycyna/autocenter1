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
  selector: 'app-estado-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './estado-create.html',
  styleUrl: './estado-create.css',
})
export class EstadoCreate implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<EstadoCreate>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formEstado: UntypedFormGroup;
  resource : string = 'estados';
  paises: any[] = [];

  ngOnInit(): void {
    this.formEstado = this.fb.group({
      id: [0, [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      sigla: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      paisId: ['', [Validators.required]]
    });
    this.getPaises();
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

  criar(){
    if (this.formEstado.valid) {
      try{
        this.crudService.create(this.formEstado.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Estado criado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao criar estado:', err),
        });
      }catch (err: unknown) {
        this.crudService.showMessage('Error ${err}', true);
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
}
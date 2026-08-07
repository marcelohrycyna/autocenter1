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
  selector: 'app-cidade-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './cidade-create.html',
  styleUrl: './cidade-create.css',
})
export class CidadeCreate implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<CidadeCreate>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formCidade: UntypedFormGroup;
  resource : string = 'cidades';
  estados: any[] = [];

  ngOnInit(): void {
    this.formCidade = this.fb.group({
      id: [0, [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      estadoId: ['', [Validators.required]]
    });
    this.getEstados();
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

  criar(){
    if (this.formCidade.valid) {
      try{
        this.crudService.create(this.formCidade.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Cidade criada com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao criar cidade:', err),
        });
      }catch (err: unknown) {
        this.crudService.showMessage('Error ${err}', true);
        this.router.navigate(['/cidades']);
      }
    }
  }

  public cancel(): void{
    window.history.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formCidade.controls[controlName].hasError(errorName);
  }
}
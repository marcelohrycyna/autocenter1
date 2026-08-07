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
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cliente-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, NgxMaskDirective],
  templateUrl: './cliente-create.html',
  styleUrl: './cliente-create.css',
})
export class ClienteCreate implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<ClienteCreate>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formCliente: UntypedFormGroup;
  resource : string = 'clientes';
  cidades: any[] = [];

  ngOnInit(): void {
    this.formCliente = this.fb.group({
      id: [0, [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      rua: ['', [Validators.maxLength(150)]],
      numero: ['', [Validators.maxLength(100)]],
      cep: ['', [Validators.maxLength(50)]],
      bairro: ['', [Validators.maxLength(100)]],
      complemento: ['', [Validators.maxLength(150)]],
      email: ['', [Validators.email, Validators.maxLength(200)]],
      cpf: ['', [Validators.maxLength(14)]],
      telefone: ['', [Validators.maxLength(20)]],
      cidadeId: ['', [Validators.required]]
    });
    this.getCidades();
  }

  getCidades(): void {
    this.crudService.getAll('cidades').subscribe({
      next: (retorno: any) => {
        this.cidades = retorno?.data ?? retorno;
      },
      error: (err: any) => {
        console.error('Erro ao buscar as cidades:', err);
      }
    });
  }

  criar(){
    if (this.formCliente.valid) {
      try{
        this.crudService.create(this.formCliente.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Cliente criado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao criar cliente:', err),
        });
      }catch (err: unknown) {
        this.crudService.showMessage('Error ${err}', true);
        this.router.navigate(['/clientes']);
      }
    }
  }

  public cancel(): void{
    window.history.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formCliente.controls[controlName].hasError(errorName);
  }
}
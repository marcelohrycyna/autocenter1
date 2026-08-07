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
  selector: 'app-automovel-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './automovel-create.html',
  styleUrl: './automovel-create.css',
})
export class AutomovelCreate implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cliente: any },
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<AutomovelCreate>,
    private router: Router,
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formAutomovel: UntypedFormGroup;
  resource : string = 'automoveis';
  clientes: any[] = [];

  ngOnInit(): void {
    const idDoCliente = this.data.cliente?.id;

    this.formAutomovel = this.fb.group({
      id: [0, [Validators.required]],
      modelo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      marca: ['', [Validators.maxLength(100)]],
      ano: ['', [Validators.maxLength(4)]],
      cor: ['', [Validators.maxLength(50)]],
      placa: ['', [Validators.maxLength(10)]],
      clienteId: [idDoCliente || '', [Validators.required]]
    });

    if (this.data && this.data.cliente) {
      const clienteRecebido = this.data.cliente;
      this.clientes.unshift(clienteRecebido);
    }
    else {
      this.getClientes();
    }
    
  }

  getClientes(): void {
    this.crudService.getAll('clientes').subscribe({
      next: (retorno: any) => {
        this.clientes = retorno?.data ?? retorno;
      },
      error: (err: any) => {
        console.error('Erro ao buscar os clientes:', err);
      }
    });
  }

  criar(){
    if (this.formAutomovel.valid) {
      try{
        this.crudService.create(this.formAutomovel.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Automóvel criado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao criar automóvel:', err),
        });
      }catch (err: unknown) {
        this.crudService.showMessage('Error ${err}', true);
        this.router.navigate(['/automoveis']);
      }
    }
  }

  public cancel(): void{
    window.history.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formAutomovel.controls[controlName].hasError(errorName);
  }
}
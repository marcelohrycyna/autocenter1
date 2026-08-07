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
  selector: 'app-automovel-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './automovel-edit.html',
  styleUrl: './automovel-edit.css',
})
export class AutomovelEdit implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataId: any,
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<AutomovelEdit>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formAutomovel: UntypedFormGroup;
  resource : string = 'automoveis';
  clientes: any[] = [];

  ngOnInit(): void {
    this.formAutomovel = this.fb.group({
      id: [this.dataId, [Validators.required]],
      modelo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      marca: ['', [Validators.maxLength(100)]],
      ano: ['', [Validators.maxLength(4)]],
      cor: ['', [Validators.maxLength(50)]],
      placa: ['', [Validators.maxLength(10)]],
      clienteId: ['', [Validators.required]]
    });
    this.getAutomovel();
    this.getClientes();
  }

  getAutomovel(): void {
    this.crudService.getById(this.dataId, this.resource).subscribe({
      next: (retorno: any) => {
        const automovel = retorno?.data ?? retorno;

        if (automovel) {
          this.PreencherFormGroup(automovel);
        } else {
          console.error('Resposta inesperada ao buscar o automóvel:', retorno);
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar o automóvel:', err);
      }
    });
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

  update(){
    if (this.formAutomovel.valid) {
      try{
        this.crudService.update(this.dataId, this.formAutomovel.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Automóvel atualizado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao atualizar automóvel:', err),
        });
      } catch (err: unknown) {
        this.crudService.showMessage(`Erro: ${err}`, true);
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

  private PreencherFormGroup(obj: any): void {
    const automovel = obj ?? {};

    this.formAutomovel.patchValue({
      id: automovel.id ?? this.dataId,
      modelo: automovel.modelo ?? '',
      marca: automovel.marca ?? '',
      ano: automovel.ano ?? '',
      cor: automovel.cor ?? '',
      placa: automovel.placa ?? '',
      clienteId: automovel.clienteId ?? ''
    });
  }
}

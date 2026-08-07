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
  selector: 'app-servico-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, NgxMaskDirective],
  templateUrl: './servico-edit.html',
  styleUrl: './servico-edit.css',
})
export class ServicoEdit implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataId: any,
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<ServicoEdit>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formServico: UntypedFormGroup;
  resource : string = 'servicos';
  
  ngOnInit(): void {
    this.formServico = this.fb.group({
      id: [this.dataId, [Validators.required]],
      tipo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.maxLength(500)]],
      valor: ['', [Validators.required]]
    });
    this.getServico();
  }

  getServico(): void {
    this.crudService.getById(this.dataId, this.resource).subscribe({
      next: (retorno: any) => {
        const servico = retorno?.data ?? retorno;

        if (servico) {
          this.PreencherFormGroup(servico);
        } else {
          console.error('Resposta inesperada ao buscar o serviço:', retorno);
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar o serviço:', err);
      }
    });
  }

  update(){
    if (this.formServico.valid) {
      try{
        this.crudService.update(this.dataId, this.formServico.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Serviço atualizado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao atualizar serviço:', err),
        });
      } catch (err: unknown) {
        this.crudService.showMessage(`Erro: ${err}`, true);
        this.router.navigate(['/servicos']);
      }
    }
  }

  public cancel(): void{
    window.history.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formServico.controls[controlName].hasError(errorName);
  }

  private PreencherFormGroup(obj: any): void {
    const servico = obj ?? {};

    this.formServico.patchValue({
      id: servico.id ?? this.dataId,
      tipo: servico.tipo ?? '',
      descricao: servico.descricao ?? '',
      valor: servico.valor ?? ''
    });
  }
}
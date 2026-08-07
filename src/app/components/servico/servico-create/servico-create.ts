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
  selector: 'app-servico-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, NgxMaskDirective],
  templateUrl: './servico-create.html',
  styleUrl: './servico-create.css',
})
export class ServicoCreate implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private dialogRef: MatDialogRef<ServicoCreate>,
    private router: Router
  ) { }

  @Output() submitclicked = new EventEmitter<any>(); //devido ao modal, avisa o componente pai que o submit foi clicado
  public formServico: UntypedFormGroup;
  resource : string = 'servicos';

  ngOnInit(): void {
    this.formServico = this.fb.group({
      id: [0, [Validators.required]],
      tipo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.maxLength(500)]],
      valor: ['', [Validators.required]]
    });
  }

  criar(){
    if (this.formServico.valid) {
      try{
        this.crudService.create(this.formServico.value, this.resource).subscribe({
          next:(retorno:any)=>{
            this.submitclicked.emit(retorno); //avisa o componente pai que o submit foi clicado
            this.dialogRef.close();
            this.crudService.showMessage(
              'Serviço criado com sucesso!', 
              false
            );
          },
        error: (err) => console.error('Erro ao criar serviço:', err),
        });
      }catch (err: unknown) {
        this.crudService.showMessage('Error ${err}', true);
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
}
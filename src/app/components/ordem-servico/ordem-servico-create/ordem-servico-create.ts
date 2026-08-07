import { FormArray, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';;
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrudService } from '../../crud.service';
import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { UtilitariosService } from '../../utilitarios.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ordem-servico-create',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule, 
    NgxMaskDirective, 
    FormsModule
  ],
  providers: [],
  templateUrl: './ordem-servico-create.html',
  styleUrl: './ordem-servico-create.css',
})
export class OrdemServicoCreate implements OnInit {
  
  @Output() submitclicked = new EventEmitter<any>();

  public formOrdemServico!: UntypedFormGroup;
  public formCliente!: UntypedFormGroup;
  public formAutomovel!: UntypedFormGroup;
  
  resource: string = 'ordemservicos';
  clientes: any[] = [];
  automoveis: any[] = [];
  listaServicos: any[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private utilitariosService: UtilitariosService,
    private dialogRef: MatDialogRef<OrdemServicoCreate>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formOrdemServico = this.fb.group({
      id: [0, [Validators.required]],
      data_entrada: ['', [Validators.required, Validators.maxLength(10)]],
      data_saida: [null, [Validators.maxLength(10)]],
      observacao: ['', [Validators.maxLength(1000)]],
      clienteId: ['', [Validators.required]],
      automovelId: ['', [Validators.required]],
      formServicos: this.fb.array([]) // Array interno que armazena os serviços
    });

    this.formCliente = this.fb.group({
      cpf: [''],
      telefone: [''],
      cidade: ['']
    });
    this.formCliente.disable();

    this.formAutomovel = this.fb.group({
      placa: [''],
      cor: ['']
    });
    this.formAutomovel.disable();

    this.getClientes();
    this.getServicos(); // Carrega a lista de serviços do banco de dados

    // Escuta as alterações no campo clienteId em tempo real
    this.formOrdemServico.get('clienteId')?.valueChanges.subscribe((clienteId) => {
      this.escutaCampoClienteEAtualizaAutomoveis(clienteId);
      this.atualizaFormCliente(clienteId);
    });

    // Escuta as alterações no campo automovelId em tempo real
    this.formOrdemServico.get('automovelId')?.valueChanges.subscribe((automovelId) => {
      this.atualizaFormAutomovel(automovelId);
    });
  }

  // GETTER ESSENCIAL: Resolve o erro de compilação do seu arquivo HTML
  get servicos(): FormArray {
    return this.formOrdemServico.get('formServicos') as FormArray;
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

  // Método corrigido para buscar os serviços disponíveis e alimentar a lista
  getServicos(): void {
    this.crudService.getAll('servicos').subscribe({
      next: (retorno: any) => {
        this.listaServicos = retorno?.data ?? retorno;
      },
      error: (err: any) => {
        console.error('Erro ao buscar os serviços do banco:', err);
      }
    });
  }

  escutaCampoClienteEAtualizaAutomoveis(clienteId: string): void {
    this.formOrdemServico.get('automovelId')?.setValue('');
    if (!clienteId) {
      this.formAutomovel.reset();
      this.automoveis = [];
      return;
    }
    this.crudService.getByClienteId('automoveis', clienteId).subscribe({
      next: (retorno: any) => {
        this.automoveis = retorno?.data ?? retorno;
      },
      error: (err: any) => {
        console.error('Erro ao buscar os automoveis:', err);
      }
    });
  }

  atualizaFormCliente(clienteId: string): void {
    this.limpaFormAutomovel();
    try {
      const cliente = this.clientes.find(p => p.id === clienteId);
      if (cliente) {
        this.formCliente.patchValue({
          cpf: cliente.cpf ?? '',
          telefone: cliente.telefone ?? '',
          cidade: cliente.cidade?.nome ?? ''
        });
      }
    } catch (err: unknown) {
      this.crudService.showMessage(`Error ${err}`, true);
      this.router.navigate(['/ordem-servico']);
    }
  }

  atualizaFormAutomovel(automovelId: string): void {
    if (!automovelId) {
      return;
    }
    try {
      const automovel = this.automoveis.find(p => p.id === automovelId);
      if (automovel) {
        this.formAutomovel.patchValue({
          placa: automovel.placa ?? '',
          cor: automovel.cor ?? '',
        });
      }
    } catch (err: unknown) {
      this.crudService.showMessage(`Error ${err}`, true);
      this.router.navigate(['/ordem-servico']);
    }
  }

  limpaFormAutomovel() {
    this.formAutomovel.reset();
  }

  // Cria a estrutura exata exigida pelo array interno "servicos" do seu JSON final
  criarServicoFormGroup(): FormGroup {
    const grupo = this.fb.group({
      ordem_servicoId:0,
      servicoId: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valor_unitario: [0, [Validators.required, Validators.min(0)]],
      valor_total: [{ value: 0, disabled: true }]
    });

    // Escuta alterações em tempo real para recalcular o valor total da linha
    grupo.valueChanges.subscribe(() => {
      this.calcularTotalItem(grupo);
    });

    return grupo;
  }

  adicionarServico() {
    this.servicos.push(this.criarServicoFormGroup());
  }

  removerServico(index: number) {
    this.servicos.removeAt(index);
  }

  // Método modificado para receber o valor do ID enviado diretamente pelo (selectionChange) do HTML
  onServicoSelecionado(index: number, servicoSelecionadoId: any) {
    const grupo = this.servicos.at(index) as FormGroup;
    const servicoDados = this.listaServicos.find(s => s.id === Number(servicoSelecionadoId));

    if (servicoDados) {
      grupo.patchValue({
        valor_unitario: servicoDados.preco ?? servicoDados.valor // caso sua API use 'preco' ou 'valor'
      });
    }
  }

  calcularTotalItem(grupo: FormGroup) {
    const qtd = grupo.get('quantidade')?.value || 0;
    const unitario = grupo.get('valor_unitario')?.value || 0;
    const total = qtd * unitario;

    grupo.get('valor_total')?.setValue(total, { emitEvent: false });
  }

  criar() {
    if (this.formOrdemServico.valid) {
      try {
        // Coleta o payload estruturado incluindo os campos desabilitados (valor_total) e o array correto
        const payloadCompleto = this.formOrdemServico.getRawValue();

        // Mapeia o nome interno "formServicos" de volta para "servicos" para bater com o seu backend
        payloadCompleto.servicos = payloadCompleto.formServicos;
        delete payloadCompleto.formServicos;

        payloadCompleto.data_entrada = this.utilitariosService.formatarDataParaIso(payloadCompleto.data_entrada);
        payloadCompleto.data_saida = this.utilitariosService.formatarDataParaIso(payloadCompleto.data_saida);

        this.crudService.create(payloadCompleto, this.resource).subscribe({
          next: (retorno: any) => {
            this.submitclicked.emit(retorno);
            this.dialogRef.close();
            this.crudService.showMessage('Ordem de serviço criada com sucesso!', false);
          },
          error: (err) => console.error('Erro ao criar ordem de serviço:', err),
        });
      } catch (err: unknown) {
        this.crudService.showMessage(`Error ${err}`, true);
        this.router.navigate(['/ordem-servico']);
      }
    }
  }

  public cancel(): void {
    window.history.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formOrdemServico.controls[controlName].hasError(errorName);
  }
}
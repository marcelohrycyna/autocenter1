import { FormArray, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrudService } from '../../crud.service';
import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { UtilitariosService } from '../../utilitarios.service';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ordem-servico-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatDialogActions,
    NgxMaskDirective,
    FormsModule
  ],
  providers: [],
  templateUrl: './ordem-servico-edit.html',
  styleUrl: './ordem-servico-edit.css',
})
export class OrdemServicoEdit implements OnInit {


  @Output() submitclicked = new EventEmitter<any>();

  public formOrdemServico!: UntypedFormGroup;
  public formCliente!: UntypedFormGroup;
  public formAutomovel!: UntypedFormGroup;

  resource: string = 'ordemservicos';
  clienteId: string = '';
  automovelId: string = '';
  automoveis: any[] = [];
  listaServicos: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dataId: any,
    private fb: UntypedFormBuilder,
    private crudService: CrudService,
    private utilitariosService: UtilitariosService,
    private dialogRef: MatDialogRef<OrdemServicoEdit>,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.formOrdemServico = this.fb.group({
      id: [this.dataId, [Validators.required]],
      data_entrada: ['', [Validators.required, Validators.maxLength(10)]],
      data_saida: [null, [Validators.maxLength(10)]],
      observacao: ['', [Validators.maxLength(1000)]],
      cliente: [{ value: '', disabled: true }, [Validators.required]],
      clienteId: ['', [Validators.required]],
      automovelId: [null, [Validators.required]],
      fechado: [null, [Validators.required]],
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

    await this.getServicos();
    await this.getOrdemServico();

    await this.getCliente();
    await this.getAutomoveisDoCliente();
    await this.getServicos(); // Carrega a lista de serviços do banco de dados

    // Escuta as alterações no campo automovelId em tempo real
    this.formOrdemServico.get('automovelId')?.valueChanges.subscribe((automovelId) => {
      this.atualizaFormAutomovel(automovelId);
    });
  }

  // GETTER ESSENCIAL: Resolve o erro de compilação do seu arquivo HTML
  get servicos(): FormArray {
    return this.formOrdemServico.get('formServicos') as FormArray;
  }

  private async getCliente(): Promise<void> {
    try {
      const retorno = await firstValueFrom(this.crudService.getById(this.clienteId, 'clientes'));
      const cliente = retorno?.data ?? retorno;

      if (cliente) {
        await this.PreencherFormGroupCliente(cliente);
      } else {
        console.error('Resposta inesperada ao buscar o cliente:', retorno);
      }
    } catch (err) {
      console.error('Erro ao buscar o cliente:', err);
    }
  }

  private async getAutomoveisDoCliente(): Promise<void> {
    try {
      const retorno = await firstValueFrom(this.crudService.getByClienteId('automoveis', this.clienteId));
      this.automoveis = retorno?.data ?? retorno;

      if (this.automoveis && this.automoveis.length > 0) {
        const atualId = this.formOrdemServico.get('automovelId')?.value;
        if (atualId) {
          this.formOrdemServico.get('automovelId')?.setValue(atualId, { emitEvent: true });
        }
        await this.PreencherFormGroupAutomovel();
        return;
      }

      console.warn('Nenhum automóvel encontrado para este cliente.');
    } catch (err) {
      console.error('Erro ao buscar os automóveis:', err);
    }
  }

  async getServicos(): Promise<void> {
    try {
      const retorno = await firstValueFrom(this.crudService.getAll('servicos'));
      this.listaServicos = retorno ?? retorno;
    } catch (err) {
      console.error('Erro ao buscar os serviços do banco:', err);
    }
  }

  private async PreencherFormGroupAutomovel(): Promise<void> {
    try {
      const automovel = this.automoveis.find(p => p.id == this.automovelId);

      if (!automovel) {
        console.warn('Objeto de automóvel inválido ou vazio.');
        return;
      }
      this.formAutomovel.patchValue({
        placa: automovel.placa,
        cor: automovel.cor
      });

    } catch (err) {
      console.error('Erro ao preencher o formulário de automóvel:', err);
    }

  }

  private async atualizaFormAutomovel(automovelId: string): Promise<void> {
    if (!automovelId) {
      return;
    }
    try {
      const automovel = this.automoveis.find(p => p.id == automovelId);
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


  // Cria a estrutura exata exigida pelo array interno "servicos" do seu JSON final
  criarServicoFormGroup(): FormGroup {
    const grupo = this.fb.group({
      ordem_servicoId: this.dataId,
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

  update() {
    if (this.formOrdemServico.valid) {
      try {
        // Coleta o payload estruturado incluindo os campos desabilitados (valor_total) e o array correto
        const payloadCompleto = this.formOrdemServico.getRawValue();
        payloadCompleto.data_entrada = this.utilitariosService.formatarDataParaIso(payloadCompleto.data_entrada);
        payloadCompleto.data_saida = this.utilitariosService.formatarDataParaIso(payloadCompleto.data_saida);

        // Mapeia o nome interno "formServicos" de volta para "servicos" para bater com o seu backend
        payloadCompleto.servicos = payloadCompleto.formServicos;
        delete payloadCompleto.formServicos;
        delete payloadCompleto.cliente;

        this.crudService.update(this.dataId, payloadCompleto, this.resource).subscribe({
          next: (retorno: any) => {
            this.submitclicked.emit(retorno);
            this.dialogRef.close();
            this.crudService.showMessage('Ordem de serviço atualizada com sucesso!', false);
          },
          error: (err) => console.error('Erro ao atualizar a Ordem de serviço:', err),
        });
      } catch (err: unknown) {
        this.crudService.showMessage(`Error ${err}`, true);
        this.router.navigate(['/ordem-servico']);
      }
    }
  }

  private async PreencherFormGroupCliente(obj: any): Promise<void> {
    const cliente = obj ?? {};

    this.formOrdemServico.patchValue({
      cliente: cliente.nome ?? ''
    })

    this.formCliente.patchValue({
      id: cliente.id ?? this.dataId,
      cpf: cliente.cpf ?? '',
      telefone: cliente.telefone ?? '',
      cidade: cliente.cidade?.nome ?? ''
    });
  }

  private async getOrdemServico(): Promise<void> {

    try {
      const retorno = await firstValueFrom(this.crudService.getById(this.dataId, this.resource));
      const os = retorno?.data ?? retorno;

      if (os) {
        await this.PreencherFormOrdemServico(os);
        await this.PreencherFormServicos(os);
      } else {
        console.error('Resposta inesperada ao buscar a Ordem de Serviço:', retorno);
      }
    } catch (err) {
      console.error('Erro ao buscar a Ordem de Serviço:', err);
    }
  }

  private async PreencherFormOrdemServico(obj: any): Promise<void> {
    const os = obj ?? {};

    this.formOrdemServico.patchValue({
      id: os.id ?? this.dataId,
      data_entrada: this.utilitariosService.formatarDataParaPadraoBr(os.data_entrada) ?? '',
      data_saida: this.utilitariosService.formatarDataParaPadraoBr(os.data_saida) ?? '',
      observacao: os.observacao ?? '',
      automovelId: os.automovelId ?? null,
      clienteId: os.clienteId ?? null,
      fechado: os.fechado
    });
    this.clienteId = os.clienteId;
    this.automovelId = os.automovelId;
  }

  private async PreencherFormServicos(obj: any): Promise<void> {
    const os = obj ?? {};
    const dadosServicos = os.servicos ?? [];

    // Limpa registros antigos caso existam
    this.servicos.clear();

    if (Array.isArray(dadosServicos)) {
      dadosServicos.forEach((servicoItem: any) => {
        const grupo = this.criarServicoFormGroup();
        grupo.patchValue({
          ordem_servicoId: servicoItem.ordem_servicoId ?? os.id,
          servicoId: servicoItem.servicoId ?? servicoItem.id,
          quantidade: servicoItem.quantidade ?? 1,
          valor_unitario: servicoItem.valor_unitario ?? servicoItem.preco ?? 0
        });
        // Força o cálculo do total para o item carregado
        this.calcularTotalItem(grupo);
        // Insere o grupo montado no FormArray principal
        this.servicos.push(grupo);
      });
    }
  }

  public cancel(): void {
    window.history.back();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formOrdemServico.controls[controlName].hasError(errorName);
  }
}
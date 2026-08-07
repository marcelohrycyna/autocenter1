import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ToastrService } from "ngx-toastr";
import proxyConfig from "../../proxy.conf.json";

@Injectable({
    providedIn: 'root'
})

export class UtilitariosService {
    constructor() { }

    // Método auxiliar para formatar a string numérica ou com barras para YYYY-MM-DD
    formatarDataParaIso(data: string): string | null {
        if (!data) return null;

        // Remove qualquer barra se existir para trabalhar apenas com os números
        const apenasNumeros = data.replace(/\D/g, '');
        if (apenasNumeros.length !== 8) return null;

        const dia = apenasNumeros.substring(0, 2);
        const mes = apenasNumeros.substring(2, 4);
        const ano = apenasNumeros.substring(4, 8);

        return `${ano}-${mes}-${dia}`; // Retorna "2026-10-30"
    }

    // Método auxiliar para formatar a string numérica ou com barras para DD-MM-YYYY
    formatarDataParaPadraoBr(data: string): string | null {
        if (!data) return null;
        console.log('antes',data)

        // Isola os 10 primeiros caracteres caso venha no formato Date/Time (Ex: "2026-07-31T20:00:00Z")
        const dataApenas = data.substring(0, 10);

        // Divide o texto usando Regex que aceita tanto "-" quanto "/"
        const partes = dataApenas.split(/[-/]/);

        // Valida se a string foi dividida corretamente em 3 partes (Ano, Mês, Dia)
        if (partes.length !== 3) return null;

        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];

        // Garante o retorno estruturado no formato "dd-mm-yyyy"
        console.log('depois',`${dia}-${mes}-${ano}`)
        return `${dia}-${mes}-${ano}`;
    }
}
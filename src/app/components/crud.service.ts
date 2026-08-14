import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ToastrService } from "ngx-toastr";
import proxyConfig from "../../proxy.conf.json";

const proxySettings = proxyConfig as { global?: { apiTarget?: string } };

@Injectable({
    providedIn: 'root'
})

export class CrudService{
    constructor(private readonly http: HttpClient, @Inject(Injector) private injector:Injector){}
    private readonly serverUrl = proxySettings.global?.apiTarget ?? 'http://localhost:8080';

    getAll(resource: string): Observable<any[]>{
        return this.http.get<any[]>(`${this.serverUrl}${resource}`);
    }

    getById(id: string, resource: string): Observable<any>{
        return this.http.get<any>(`${this.serverUrl}${resource}/${id}`);
    }

    update(id: string, payload: any, resource: string): Observable<any>{
        return this.http.put<any>(`${this.serverUrl}${resource}/${id}`, payload);
    }

    create(payload: any, resource: string): Observable<any>{
        return this.http.post<any>(`${this.serverUrl}${resource}`, payload);
    }

    delete(id: string, resource: string): Observable<any>{
        return this.http.delete<any>(`${this.serverUrl}${resource}/${id}`);
    }

    getByClienteId(resource: string, id: string): Observable<any>{
        return this.http.get<any[]>(`${this.serverUrl}${resource}/cliente/${id}`);
    }

    getPersonalizado(resource: string, pathPersonalizado: string): Observable<any>{
        console.log(`${this.serverUrl}${resource}${pathPersonalizado}`);
        return this.http.get<any[]>(`${this.serverUrl}${resource}${pathPersonalizado}`);
    }

    private get toastrService(): ToastrService{
        return this.injector.get(ToastrService);
    }

    showMessage(msg: string, isError: boolean = false): void{
        isError
        ? this.toastrService.error(`${msg}`, 'Operação não efetuada.')
        : this.toastrService.info(`${msg}`, 'Operação efetuada com sucesso.')
    }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})




export class MateriasService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService) {}

  /**
   * Devuelve la estructura inicial de una materia.
   */
  public esquemaMateria() {
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias_json': [],
      'hora_inicio': '',
      'hora_final': '',
      'salon': '',
      'programa_edu': '',
      'profesor': '',
      'creditos': '',
    };
  }

  /**
   * Valida los datos de la materia.
   */
  public validarMateria(data: any, editar: boolean) {
    console.log("Validando materia... ", data);
    let error: any = {};

    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["nrc"])){
      error["nrc"] = this.errorService.numeric;
    }else if(!this.validatorService.min(data["nrc"], 5)){
      error["nrc"] = this.errorService.min(5);
    }else if(!this.validatorService.max(data["nrc"], 6)){
      error["nrc"] = this.errorService.max(6);
    }

    if(!this.validatorService.required(data["nombre"])){
      error["nombre"] = this.errorService.required;
    }else if(!this.validatorService.words(data["nombre"])){
      error["nombre"] = "El nombre solo puede contener letras y espacios";
    }

    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["seccion"])){
      error["seccion"] = this.errorService.numeric;
    }else if(!this.validatorService.max(data["seccion"], 3)){
      error["seccion"] = this.errorService.max(3);
    }

    if(!this.validatorService.required(data["dias_json"])){
      error["dias_json"] = "Debes seleccionar al menos un día";
    }else if(!Array.isArray(data["dias_json"]) || data["dias_json"].length === 0){
      error["dias_json"] = "Debes seleccionar al menos un día";
    }

    if(!this.validatorService.required(data["hora_inicio"])){
      error["hora_inicio"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["hora_final"])){
      error["hora_final"] = this.errorService.required;
    }

    if(this.validatorService.required(data["hora_inicio"]) && this.validatorService.required(data["hora_final"])){
      // Convertir horas a minutos para comparar
      const horaInicio = this.convertirHoraAMinutos(data["hora_inicio"]);
      const horaFinal = this.convertirHoraAMinutos(data["hora_final"]);
      if(horaInicio >= horaFinal){
        error["hora_inicio"] = "La hora de inicio debe ser menor que la hora de finalización";
      }
    }

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required;
    }else if(!this.validatorService.max(data["salon"], 15)){
      error["salon"] = this.errorService.max(15);
    }else if(/[^a-zA-Z0-9\s]/.test(data["salon"])){
      error["salon"] = "El salón solo puede contener caracteres alfanuméricos y espacios";
    }

    if(!this.validatorService.required(data["programa_edu"])){
      error["programa_edu"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["profesor"])){
      error["profesor"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["creditos"])){
      error["creditos"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["creditos"])){
      error["creditos"] = this.errorService.numeric;
    }else if(Number(data["creditos"]) < 1){
      error["creditos"] = "Los créditos deben ser un número positivo";
    }else if(Number(data["creditos"]) > 99){
      error["creditos"] = this.errorService.max(99);
    }

    return error;
  }

  /**
   * Convierte una hora en formato string a minutos para comparación
   */
  private convertirHoraAMinutos(hora: string): number {
    if(!hora) return 0;
    // Formato esperado: "HH:MM AM/PM" o "HH:MM"
    const partes = hora.split(' ');
    let horaMin = partes[0].split(':');
    let horas = parseInt(horaMin[0]);
    let minutos = parseInt(horaMin[1]) || 0;
    
    if(partes.length > 1 && partes[1].toUpperCase() === 'PM' && horas !== 12){
      horas += 12;
    }else if(partes.length > 1 && partes[1].toUpperCase() === 'AM' && horas === 12){
      horas = 0;
    }
    
    return horas * 60 + minutos;
  }


  /**
   * Registra una materia en el sistema.
   */
  public registrarMateria(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/materias/`, data, httpOptions);
  }

  /**
   * Obtiene la lista de materias.
   */
  public obtenerListaMaterias(): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-materia/`, {headers:headers});
  }

  /**
   * Obtiene una materia por su NRC.
   */
  public getMateriaByID(idMateria: Number){
    return this.http.get<any>(`${environment.url_api}/materias/?id=${idMateria}`,httpOptions);
  }

  /**
   * Edita los datos de una materia existente.
   */
  public editarMateria(data: any): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/materias/?id=${data.id}`, data, {headers:headers});
  }

  /**
   * Elimina una materia por su NRC.
   */
  public eliminarMateria(nrc: number): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/materias/?nrc=${nrc}`,{headers:headers});
  }
}

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
  // public validarMateria(data: any) {
  //   let error: any = {};
  //   if (!data.nrc || isNaN(data.nrc) || data.nrc.length < 5 || data.nrc.length > 6) {
  //     error['nrc'] = 'El NRC debe tener entre 5 y 6 dígitos numéricos.';
  //   }
  //   if (!data.nombre || /[^a-zA-Z0-9\s]/.test(data.nombre)) {
  //     error['nombre'] = 'El nombre solo puede contener letras, números y espacios.';
  //   }
  //   if (!data.seccion || isNaN(data.seccion) || data.seccion.length > 3) {
  //     error['seccion'] = 'La sección debe ser numérica y tener máximo 3 dígitos.';
  //   }
  //   if (!data.dias_json || data.dias_json.length === 0) {
  //     error['dias_json'] = 'Debes seleccionar al menos un día.';
  //   }
  //   if (!data.hora_inicio || !data.hora_final || data.hora_inicio >= data.hora_final) {
  //     error['hora_inicio'] = 'La hora de inicio debe ser menor que la hora de finalización.';
  //   }
  //   if (!data.salon || /[^a-zA-Z0-9\s]/.test(data.salon)) {
  //     error['salon'] = 'El salón solo puede contener caracteres alfanuméricos y espacios.';
  //   }
  //   if (!data.programa_edu) {
  //     error['programa_edu'] = 'El programa educativo es obligatorio.';
  //   }
  //   if (!data.profesor) {
  //     error['profesor'] = 'El profesor es obligatorio.';
  //   }
  //   if (!data.creditos || isNaN(data.creditos) || data.creditos < 1 || data.creditos > 99) {
  //     error['creditos'] = 'Los créditos deben ser un número entre 1 y 99.';
  //   }
  //   console.log(error);

  //   return error;
  // }


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

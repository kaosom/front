import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MatDialog } from '@angular/material/dialog';
import { MaestrosService } from 'src/app/services/maestros.service';
import { ActualizarUserModalComponent } from 'src/app/modals/actualizar-user-modal/actualizar-user-modal.component';
declare var $:any;

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']

})
export class RegistroMateriasComponent implements OnInit {
  public materias: any = {};
  public token: string = "";
  public editar: boolean = false;
  public errors: any = {};
  public idMateria: Number = 0;
  public profesores:any [] = [];

  public carreras:any[]= [
    {value: '1', viewValue: 'Ingenieria en Ciencias de la Computacion'},
    {value: '2', viewValue: 'Licenciatura en Ciencias de la Computacion'},
    {value: '3', viewValue: 'Ingenieria en Tecnologias de la Informacion'},
  ];

  public dias:any[]= [
    {value: '1', nombre: 'Lunes'},
    {value: '2', nombre: 'Martes'},
    {value: '3', nombre: 'Miercoles'},
    {value: '4', nombre: 'Jueves'},
    {value: '5', nombre: 'Viernes'},
  ];

  constructor(
    private location: Location,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    public dialog : MatDialog,
  ){}

  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      console.log("ID Materia: ", this.idMateria);
      this.materias = this.materiasService.esquemaMateria();
      this.getMateriaByID();
    }else{
      this.materias = this.materiasService.esquemaMateria();
      this.token = this.facadeService.getSessionToken();
    }
    this.obtenerProfesores();
  }

  public regresar(){
    this.location.back()
  }

  public registrar(){
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materias, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }

    // Verificar que el NRC no esté duplicado
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        const listaMaterias = response;
        const nrcDuplicado = listaMaterias.find((m: any) => m.nrc === this.materias.nrc);
        if(nrcDuplicado){
          this.errors["nrc"] = "El NRC ya existe en la base de datos";
          return false;
        }

        // Si no hay duplicado, proceder con el registro
        console.log(this.materias);
        this.materias.profesor = String(this.materias.profesor);

        this.materiasService.registrarMateria(this.materias).subscribe(
          (response)=>{
            alert("Materia registrada correctamente");
            console.log("Materia registrada: ", response);
            this.location.back();
          }, (error)=>{
            alert("No se pudo registrar la materia");
          }
        );
      },
      (error) => {
        // Si hay error al obtener la lista, aún así intentar registrar
        // El backend validará la unicidad
        console.log(this.materias);
        this.materias.profesor = String(this.materias.profesor);

        this.materiasService.registrarMateria(this.materias).subscribe(
          (response)=>{
            alert("Materia registrada correctamente");
            console.log("Materia registrada: ", response);
            this.location.back();
          }, (error)=>{
            alert("No se pudo registrar la materia");
          }
        );
      }
    );
  }

  public actualizar(){
    //Validación
    this.errors = {};

    this.errors = this.materiasService.validarMateria(this.materias, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    const materia = this.materias;
    const nombreMateria = materia ? materia.nombre : '';
    const dialogRef = this.dialog.open(ActualizarUserModalComponent,{
      data: {
        id: this.materias.id,
        rol: 'materia',
        nombre: nombreMateria
      },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isUpdate){
        this.materiasService.editarMateria(this.materias).subscribe(
          (response)=>{
            alert("Materia editada correctamente");
            console.log("Materia editada: ", response);
            //Si se editó, entonces mandar al home
            this.router.navigate(["home"]);
          }, (error)=>{
            alert("No se pudo editar la materia");
            console.log("Error: ", error);
          }
        );
      }else{
        console.log("Actualización cancelada");
      }
    });
  }


  public checkboxChange(event: any){
    if(event.checked){
      this.materias.dias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materias.dias_json.forEach((dia, i) => {
        if(dia == event.source.value){
          this.materias.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array dias: ", this.materias);
  }

  public revisarSeleccion(nombre: string){
    if(this.materias && this.materias.dias_json){
      if(Array.isArray(this.materias.dias_json)){
        var busqueda = this.materias.dias_json.find((element)=>element==nombre);
        if(busqueda != undefined){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  public getMateriaByID(){
    this.materiasService.getMateriaByID(this.idMateria).subscribe(
      (response) => {
        this.materias = response;
        if(this.materias.dias_json){
          if(typeof this.materias.dias_json === 'string'){
            try {
              this.materias.dias_json = JSON.parse(this.materias.dias_json.replace(/'/g, '"'));
            } catch(e) {
              this.materias.dias_json = [];
            }
          }
          if(!Array.isArray(this.materias.dias_json)){
            this.materias.dias_json = [];
          }
        }else{
          this.materias.dias_json = [];
        }
        console.log("Array de dias: ", this.materias.dias_json);
        if(this.materias.profesor){
          this.materias.profesor = Number(this.materias.profesor);
        }
        this.asignarProfesor();
      },
      (error) => {
        alert("Error al obtener los datos de la materia para editar");
        console.log("Error: ", error);
      }
    )
  }

  obtenerProfesores(): void {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.profesores = response;
        this.asignarProfesor();
      },
      (error) => {
        console.error('Error al obtener la lista de profesores:', error);
      }
    );
  }

  private asignarProfesor(): void {
    if(this.editar && this.materias && this.materias.profesor && this.profesores.length > 0){
      const profesorId = Number(this.materias.profesor);
      const profesorExiste = this.profesores.find(p => p.id === profesorId);
      if(profesorExiste){
        this.materias.profesor = profesorId;
      }
    }
  }

  soloNumeros(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  soloLetras(event: KeyboardEvent): void {
    if (!/^[a-zA-Z\s]+$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  soloAlfanumericos(event: KeyboardEvent): void {
    if (!/^[a-zA-Z0-9\s]$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

}

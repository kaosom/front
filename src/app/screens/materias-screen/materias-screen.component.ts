import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';


@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];

  // Para la tabla
  displayedColumns: string[] = ['nrc', 'nombre', 'seccion', 'dias', 'programa_edu', 'profesor', 'horario', 'salon', 'creditos', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    // Validar que haya inicio de sesión
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if (this.token == "") {
      this.router.navigate([""]);
    }
    // Obtener materias
    this.obtenerMaterias();
    // Para paginador
    this.initPaginator();
  }

  // Configuración del paginador
  public initPaginator() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      // Configuración personalizada del paginador
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    }, 500);
  }

  public obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;
        console.log("Lista de materias: ", this.lista_materias);
        if(this.lista_materias.length > 0){
          console.log("Materias: ", this.lista_materias);
          this.dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
          this.initPaginator();
        }
      },
      (error) => {
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  public goEditar(idMateria: number) {
    this.router.navigate(["registro-materias/" + idMateria]);
  }

  public delete(id: number) {
    const materia = this.lista_materias.find(m => m.id === id);
    const nombreMateria = materia ? materia.nombre : '';
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {
        id: id,
        rol: 'materia',
        nombre: nombreMateria
      },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Materia eliminada");
        alert("Materia eliminada correctamente");
        this.obtenerMaterias();
      }else{
        alert("Materia no eliminada");
        console.log("No se eliminó la materia");
      }
    });
  }
}

// Interfaz de datos
export interface DatosMateria {
  nrc: string;
  nombre: string;
  seccion: string;
  dias_json: string;
  programa_edu: string;
  profesor: string;
  horario: string;
  salon: string;
  creditos: number;
}

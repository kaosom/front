import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  //Agregar chartjs-plugin-datalabels
  //Variables
  public total_user: any = {};

  //Histograma
  lineChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: '#F88406'
      }
    ]
  }
  lineChartOption = {
    responsive:false
  }
  lineChartPlugins = [ DatalabelsPlugin ];

  //Barras
  barChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  barChartOption = {
    responsive:false
  }
  barChartPlugins = [ DatalabelsPlugin ];

  //Circular
  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive:false
  }
  pieChartPlugins = [ DatalabelsPlugin ];

  //Dona - Doughnut
  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive:false
  }
  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  // Función para obtener el total de usuarios registrados
  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);
        this.actualizarGraficas();
      }, (error)=>{
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  // Función para actualizar las gráficas con los datos dinámicos
  public actualizarGraficas(){
    const totalAdmins = this.total_user.administradores || this.total_user.administrador || this.total_user.total_administradores || 0;
    const totalMaestros = this.total_user.maestros || this.total_user.maestro || this.total_user.total_maestros || 0;
    const totalAlumnos = this.total_user.alumnos || this.total_user.alumno || this.total_user.total_alumnos || 0;

    // Actualizar gráfica circular (pie)
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data: [totalAdmins, totalMaestros, totalAlumnos]
        }
      ]
    };

    // Actualizar gráfica dona (doughnut)
    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data: [totalAdmins, totalMaestros, totalAlumnos]
        }
      ]
    };

    // Actualizar histograma (line)
    this.lineChartData = {
      ...this.lineChartData,
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: [totalAdmins, totalMaestros, totalAlumnos]
        }
      ]
    };

    // Actualizar gráfica de barras (bar)
    this.barChartData = {
      ...this.barChartData,
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: [totalAdmins, totalMaestros, totalAlumnos]
        }
      ]
    };
  }

}

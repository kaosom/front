import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-actualizar-user-modal',
  templateUrl: './actualizar-user-modal.component.html',
  styleUrls: ['./actualizar-user-modal.component.scss']
})
export class ActualizarUserModalComponent implements OnInit {

  public rol: string = "";

  constructor(
    private dialogRef: MatDialogRef<ActualizarUserModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.rol = this.data.rol;
  }

  public cerrar_modal(){
    this.dialogRef.close({isUpdate:false});
  }

  public actualizarUser(){
    // Solo confirma la actualización, el componente padre se encarga de actualizar
    this.dialogRef.close({isUpdate:true});
  }

}


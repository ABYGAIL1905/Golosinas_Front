import { Component, OnInit } from '@angular/core';
import { Productos } from 'src/app/models/productos';
import { ProductosService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit{
   producto: Productos[] = [];
  produ = new Productos();

  ngOnInit(): void {
    this.listaProducto();
  }
constructor(
  productoService:ProductosService

){}

  listaProducto() {
   
  }

  
}

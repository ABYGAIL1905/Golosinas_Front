import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/service/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categoria:any[]=[];
  currentPage = 1;
  cate= new Categoria();
  constructor(
    public serviceCategoria:CategoriaService
  ){

  }
  ngOnInit(): void {
    this.listaCategoria();
    
  }

  listaCategoria() {
    this.serviceCategoria.listaCategoria()
       .subscribe(data => {
         this.categoria = data;
         console.log(this.categoria+"listaaaa")
       }) 
       
   }

}

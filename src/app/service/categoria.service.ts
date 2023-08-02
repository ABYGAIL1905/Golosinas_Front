import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria';
import { Observable, map } from 'rxjs';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url: string = 'http://localhost:5001/api/categoria/listar';

  constructor(private http: HttpClient) { }

  public listaCategoria(): Observable<Categoria[]> {
    return this.http
      .get(this.url )
      .pipe(map((response) => response as Categoria[]));
  }
}

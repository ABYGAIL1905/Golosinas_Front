import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria';
import { Observable, map } from 'rxjs';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url1: string = 'http://localhost:5001/api/categoria';

  constructor(private http: HttpClient) { }

  public listaCategoria(): Observable<Categoria[]> {
    return this.http
      .get(this.url1 + '/listar')
      .pipe(map((response) => response as Categoria[]));
  }
}

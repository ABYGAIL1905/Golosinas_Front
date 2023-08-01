import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService{
  private url1: string = 'http://localhost:5001/api/productos';
  private url: string = 'http://localhost:5001/api/productos/listar';
  private httpHeaders= new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient) { }

  public listarProductos(): Observable<Productos[]> {
    return this.http
      .get(this.url1 + '/listar')
      .pipe(map((response) => response as Productos[]));
  }
  public listarProductos1(): Observable<Productos[]> {
    return this.http
      .get(this.url)
      .pipe(map((response) => response as Productos[]));
  }

  public guardarProductos(producto: Productos): Observable<Productos> {
    return this.http.post<Productos>(this.url1 + '/crear', producto);
  }
}

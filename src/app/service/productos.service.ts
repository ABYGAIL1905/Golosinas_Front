import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService{
  private url: string = 'http://localhost:5001/api/productos';
  private url1: string = 'http://localhost:5001/api/productos/listar';
  private httpHeaders= new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient) { }

  public listarProductos(): Observable<Productos[]> {
    return this.http
      .get(this.url + '/listar')
      .pipe(map((response) => response as Productos[]));
  }


  public guardarProductos1(producto: Productos, body:any): Observable<Productos> {
    return this.http.post<Productos>(this.url + '/crear', producto),body;
  }
  public guardarProductos(producto: Productos): Observable<Productos> {
    return this.http.post<Productos>(this.url + '/crear', producto);
  }
 
  deleteProducto(productoObj:Productos){
    return this.http.delete<Productos>(this.url+"/eliminar/"+productoObj.id_producto);
}
public actualizar(productoObj: Productos): Observable<any> {
  return this.http.put<Productos>(this.url+"/actualizar/"+productoObj.id_producto,productoObj);
}
}

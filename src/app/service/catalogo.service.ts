import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Catalogo } from '../models/catalogo';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private url: string = 'http://localhost:5001/api/catalogo';

  constructor(
    private http: HttpClient
  ) { }

  public listaCatalogo(): Observable<Catalogo[]> {
    return this.http
      .get(this.url )
      .pipe(map((response) => response as Catalogo[]));
  }

  public guardarPonderacionLista(catalogo: Catalogo[]): Observable<Catalogo[]> {
    return this.http.post<Catalogo[]>(this.url + '/crearLista', catalogo);
  }
}

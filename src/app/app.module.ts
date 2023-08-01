import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductosComponent } from './admin/productos/productos/productos.component';
import { EmpresaComponent } from './admin/empresa/empresa/empresa.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductosService } from './service/productos.service';
import { CategoriaService } from './service/categoria.service';
import { CategoriaComponent } from './admin/categoria/categoria.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';




@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    EmpresaComponent,
    CategoriaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [CategoriaService],
  bootstrap: [AppComponent]
})
export class AppModule { 


}

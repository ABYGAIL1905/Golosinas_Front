import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductosComponent } from './admin/productos/productos/productos.component';
import { EmpresaComponent } from './admin/empresa/empresa/empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductosService } from './service/productos.service';
import { CategoriaService } from './service/categoria.service';
import { CategoriaComponent } from './admin/categoria/categoria.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { CatalogoComponent } from './admin/catalogo/catalogo.component';
import { ImprimircatalogoComponent } from './admin/catalogo/imprimircatalogo/imprimircatalogo.component';
import { ImprimircataComponent } from './admin/imprimircata/imprimircata.component';
import * as jsPDF from 'jspdf';






@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    EmpresaComponent,
    CategoriaComponent,
    CatalogoComponent,
    ImprimircatalogoComponent,
    ImprimircataComponent
 
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    FormsModule
    
  ],
  providers: [CategoriaService],
  bootstrap: [AppComponent]
})
export class AppModule { 


}

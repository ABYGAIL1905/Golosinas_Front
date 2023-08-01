import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './admin/productos/productos/productos.component';
import { EmpresaComponent } from './admin/empresa/empresa/empresa.component';
import { CategoriaComponent } from './admin/categoria/categoria.component';

const routes: Routes = [
 { 
  path: 'productos',
  component: ProductosComponent,
  pathMatch: 'full',

},
{ 
  path: 'empresa',
  component: EmpresaComponent,
  pathMatch: 'full',

},
{ 
  path: 'categorias',
  component: CategoriaComponent,
  pathMatch: 'full',

}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { 

}

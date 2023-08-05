import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Productos } from 'src/app/models/productos';
import { ProductosService } from 'src/app/service/productos.service';
import { FormsModule } from '@angular/forms';



import Swal from 'sweetalert2';
import { Catalogo } from 'src/app/models/catalogo';
import { CatalogoService } from 'src/app/service/catalogo.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/service/categoria.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit{
  frmProducto: FormGroup;
  guardadoExitoso: boolean = false;
  
  producto: any[] = [];
  dataSource:any;
  produ = new Productos();
  currentPage = 1;
  
  classUser: any;
  public previsualizacion!: string;
  public archivos: any = []
  public loading!: boolean;
  public seleccionado !: boolean;
  productosSeleccionados: Productos[] = [];
  public categorias:Categoria[]=[];
  
  selectedCategory: Categoria | null = null;


  constructor(
    public productoService:ProductosService, 
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private serviceCatalogo:CatalogoService,
    private categoriaService:CategoriaService
    ) { 
      this.frmProducto = fb.group({
        //codigo_producto: ['', Validators.required],
       foto_producto: ['', [Validators.required]],
        nombre_producto: ['', [Validators.required]],
        unidad_caja: ['', [Validators.required]],
        precio_distribuidor: ['', [Validators.required]],
        precio_mayor3: ['', [Validators.required]],
        precio_detallista: ['', [Validators.required]],
        pvp: ['', [Validators.required]],
        estado_producto: ['', [Validators.required]],
        categoria: ['', [Validators.required]]
        
    
      })
      // Crear controles de categoría y agregarlos al formulario
this.categorias.forEach(categoria => {
  const controlName = categoria.id_categoria.toString(); // Convertir el ID a una cadena
  this.frmProducto.addControl(controlName, this.fb.control(false));
});

    }

    

    onImageLoad(event: Event) {
      console.log('Imagen cargada:', event);
    }
   
    

  ngOnInit(): void {
    this.listaProducto();
    this.listaCategoria();
  }

  extraerBase64 = async ($event: any) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
  
      return new Promise((resolve: any) => {
        reader.onload = () => {
          resolve({
            base: reader.result
          });
        };
        reader.onerror = () => {
          resolve({
            base: null
          });
        };
      });
    } catch (e) {
      return null;
    }
  }
  

  
 
  capturarFile(event: any) {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      console.log(imagen);

    })
    this.archivos.push(archivoCapturado)
    // 
    // console.log(event.target.files);

  }
  
  //para subir foto
  async subirFoto(event: any) {
    this.archivos = []; // Reiniciar el arreglo de archivos antes de agregar el nuevo archivo
  
    const archivoCapturado = event.target.files[0];
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      console.log(imagen);
    });
    this.archivos.push(archivoCapturado);
  
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    console.log('Tamaño de la foto en bytes:', fileSize);
    if (fileSize > 83554432) {
      this.toastrService.error('La foto es muy pesada.', 'FOTO PESADA.');
      event.target.value = null;
    } else {
      try {
        const fotoBase64 = await this.convertToBase64(file);
        console.log('Foto convertida a Base64:', fotoBase64);
        this.produ.foto_producto = fotoBase64;
      } catch (error) {
        console.error(error);
      }
    }
  }
  
  //para convertir de base 64 en la foto 
getBase64Image(base64Data: string): string {
  return 'data:image/jpeg;base64,' + base64Data;
}

  //Conversion de la imagen en base 64
  async convertToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = btoa(reader.result as string);
        resolve(result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsBinaryString(file);
    });
  }

  

  
  async nuevo1() {
    try {
      if (this.archivos.length > 0) {
        this.produ.foto_producto = await this.convertToBase64(this.archivos[0]);
      }
    } catch (error) {
      console.error('Error al convertir la imagen a Base64:', error);
      return;
    }
  
    try {
      this.produ.nombre_producto = this.frmProducto.value.nombre_producto;
      this.produ.unidad_caja = this.frmProducto.value.unidad_caja;
      this.produ.precio_distribuidor = this.frmProducto.value.precio_distribuidor;
      this.produ.precio_mayor3 = this.frmProducto.value.precio_mayor3;
      this.produ.precio_detallista = this.frmProducto.value.precio_detallista;
      this.produ.precio_venta_publico = this.frmProducto.value.pvp;
  
      const formData = this.frmProducto.value;
      if (this.selectedCategory) {
        this.produ.categoria = this.selectedCategory; // Asignar la categoría al producto
      }
  
      this.produ.estado_producto = this.frmProducto.value.estado_producto;
  
      this.productoService.guardarProductos(this.produ)
        .subscribe(
          (response) => {
            console.log('Producto creado con éxito:', response);
            this.guardadoExitoso = true;
            this.listaProducto();
            Swal.fire('Exitoso', 'Se ha completado el registro con éxito', 'success');
          },
          (error) => {
            console.error('Error al crear el producto:', error);
            Swal.fire('Error', 'Ha ocurrido un error', 'warning');
          }
        );
  
      this.archivos = []; // Limpiar el arreglo de archivos
      this.limpiarFormulario();
    } catch (error) {
      // Manejar el error si es necesario
    }
  }
  
  // Resto del código del componente...
  
  
  

  listaProducto() {
   this.productoService.listarProductos()
      .subscribe(data => {
        this.producto = data;
        console.log(this.producto+"listaaaa")
      }) 
      
  }

  limpiarFormulario() {
    this.frmProducto.reset();
    this.produ = new Productos();
  }

  eliminarProductos(producto: Productos): void {

    Swal.fire({
      title: '¿Esta Seguro?',
          text: "No será capaz de revertirlo!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
    //COLOCAR EL CODIGO A EJECUTAR
    this.productoService.deleteProducto(producto)
        .subscribe(data => {
          this.producto = this.producto.filter(p => p !== producto);
          Swal.fire(
            'Borrado!',
                'Su archivo ha sido borrado.',
                'success'
          )
        });
            //FIN DEL CODIGO A EJECUTAR
       
      }
    })
    

  }

  
  

  editDatos(productoObj: Productos) {
    // this.crite.id_criterio = criterio.id_criterio
    // this.crite.nombre = criterio.nombre
    // this.crite.descripcion = criterio.descripcion
    this.produ = productoObj;
    this.frmProducto = new FormGroup({
      foto_producto: new FormControl(productoObj.foto_producto),
      nombre_producto: new FormControl(productoObj.nombre_producto)
      
      

    });
  }
  actualizarP() {
    this.produ.nombre_producto = this.frmProducto.value.nombre_producto;
    this.produ.foto_producto = this.frmProducto.value.foto_producto;
    this.productoService.actualizar(this.produ)
      .subscribe(response => {
        this.produ = new Productos();
        this.listaProducto();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }
  enviarSeleccionados() {
    this.productosSeleccionados = this.producto.filter((item) => item.seleccionado);
    // Guardar los productos seleccionados en el servicio
    this.productoService.setProductosSeleccionados(this.productosSeleccionados);
    console.log(this.productosSeleccionados+"enviandooooo")
    // Navegar al componente OtroComponente
    this.router.navigate(['/catalogo-productos']);
  }

  listaCategoria() {
    this.categoriaService.listaCategoria()
    .subscribe(data => {
      this.categorias = data;
     
    }) 
    console.log(this.categorias+"listaaaa Categoria")
    


}
  
}

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
  constructor(
    public productoService:ProductosService, 
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private serviceCatalogo:CatalogoService
    ) { 
      this.frmProducto = fb.group({
        //codigo_producto: ['', Validators.required],
       foto_producto: ['', [Validators.required]],
        nombre_producto: ['', [Validators.required]]
      })
    }

    

    onImageLoad(event: Event) {
      console.log('Imagen cargada:', event);
    }
   
    

  ngOnInit(): void {
    this.listaProducto();
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
  

  
  subirArchivo(): any {
    const formularioDeDatos = new FormData();
    try {
      this.loading = true;
      
      this.archivos.forEach((archivo:any) => {
        formularioDeDatos.append('files', archivo)
      })
      // formularioDeDatos.append('_id', 'MY_ID_123')
      this.productoService.guardarProductos1(this.produ,formularioDeDatos)
        .subscribe(res => {
          this.loading = false;
          console.log('Respuesta del servidor', res);

        }, () => {
          this.loading = false;
          alert('Error');
        })
    } catch (e) {
      this.loading = false;
      console.log('ERROR', e);

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
  async subirFoto(event: any) {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      console.log(imagen);

    })
    this.archivos.push(archivoCapturado)
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    console.log('Tamaño de la foto en bytes:', fileSize);
    if (fileSize > 962144) {
      this.toastrService.error('La foto es muy pesada.', 'FOTO PESADA.');
      // alert('La foto es muy pesada');
      event.target.value = null;
    } else {
      try {
        this.produ.foto_producto = await this.convertToBase64(file);
        console.log('Foto convertida a Base64:', this.produ.foto_producto);
      } catch (error) {
        console.error(error);
        
      }
    }
  }

  
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

  

  nuevo() {
  this.produ = this.frmProducto.value;
    this.productoService.guardarProductos(this.produ)
      .subscribe(
        (response) => {
          console.log('Producto creado con éxito:', response);
          this.guardadoExitoso = true;
          this.listaProducto();
          Swal.fire(
            'Exitoso',
            'Se ha completado el registro con exito',
            'success'
          )
        },
        (error) => {
          console.error('Error al crear el producto:', error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error',
            'warning'
          )
        }
      );
  }

  async nuevo1() {
    // Asignar la imagen en formato Base64 al campo 'foto_producto'
    try {
      this.produ.foto_producto = await this.convertToBase64(this.archivos[0]); // Supongo que solo se guarda una imagen
    } catch (error) {
      console.error('Error al convertir la imagen a Base64:', error);
      // Puedes mostrar un mensaje de error o manejar la situación según lo necesites
      return;
    }
    this.produ.nombre_producto = this.frmProducto.value.nombre_producto;
  
    // Resto del código para guardar el producto
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
      this.limpiarFormulario();
  }
  
  

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

  
  actualizarProductos(productoObj: Productos) {

    Swal.fire({
      title: '¿Desea modificar los campos?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'SI',
          denyButtonText: `NO`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
    //COLOCAR EL CODIGO A EJECUTAR
    this.productoService.actualizar(productoObj)
      .subscribe(data => {
        this.producto = data;
        Swal.fire({
          title: 'Producto Modificada éxitosamente',
          icon: 'success',
          iconColor :'#17550c',
          color: "#0c3255",
          confirmButtonColor:"#0c3255",
          background: "#63B68B",
        })
        //alert("Se Actualiazo");
        this.router.navigate(['/productos'])
      });
            //FIN DEL CODIGO A EJECUTAR
        //Swal.fire('Modificado!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Ningun campo modificado', '', 'info')
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
    // Filtrar los productos seleccionados y almacenarlos en productosSeleccionados
    this.productosSeleccionados = this.producto.filter((item) => item.seleccionado);
    // Navegar al componente OtroComponente y enviar los productos seleccionados como parámetro
    this.router.navigate(['/catalogo-productos'], { state: { seleccionados: this.productosSeleccionados } });
  }
  guardarDatosEnAPI1(): void {
    const catalogos: Catalogo[] = [];

 

     
    this.productosSeleccionados = this.producto.filter((item) => item.seleccionado);
    // Navegar al componente OtroComponente y enviar los productos seleccionados como parámetro
   
            this.dataSource.forEach((listacata: any) => {
              const catalogo: Catalogo = new Catalogo();

              // Asigna los valores correspondientes a las propiedades de Ponderacion
              catalogo.productoclas=listacata.id_producto;
             
              catalogos.push(catalogo);

            });
            this.serviceCatalogo.guardarPonderacionLista(catalogos).subscribe(
              (response: any) => {
                // Manejar la respuesta de la API si es necesario
                console.log(response);
                Swal.fire({
                  title: 'Catalogo guardado exitosamente',
                  icon: 'success',
                  iconColor: '#17550c',
                  color: "#0c3255",
                  confirmButtonColor: "#0c3255",
                  background: "#63B68B",
                });

                this.router.navigate(['/catalogo-productos'], { state: { seleccionados: this.productosSeleccionados } });
              },
              (error: any) => {
                // Manejar el error si ocurre alguno
                console.error(error);
              }
            );


          
        
        (error: any) => {
          // Manejar el error si ocurre alguno al obtener los registros por fecha
          console.error(error);
        }
 
    
  }

  
}

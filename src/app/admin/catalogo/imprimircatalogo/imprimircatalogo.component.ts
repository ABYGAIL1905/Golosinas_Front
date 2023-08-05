import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Catalogo } from 'src/app/models/catalogo';
import { Productos } from 'src/app/models/productos';
import { CatalogoService } from 'src/app/service/catalogo.service';
import { ProductosService } from 'src/app/service/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-imprimircatalogo',
  templateUrl: './imprimircatalogo.component.html',
  styleUrls: ['./imprimircatalogo.component.css']
})
export class ImprimircatalogoComponent {

  guardadoExitoso: boolean = false;
  
  producto: any[] = [];
  dataSource: any;
  produ = new Productos();
  currentPage = 1;
  
  classUser: any;
  public previsualizacion!: string;
  public archivos: any = []
  public loading!: boolean;
  productosSeleccionados: Productos[]=[];
  productosGuardar: any[] = [];
  productosSeleccionadosTemp: any[] = [];


 
 

  constructor(
    public productoService:ProductosService, 
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private serviceCatalogo:CatalogoService,
    private serviceProducto:ProductosService
    
    ) { 
      
    }

    

    onImageLoad(event: Event) {
      console.log('Imagen cargada:', event);
    }
   
    

  ngOnInit(): void {
    
   this.productosRecibidos();
    //this.listaProducto();
    
    
  }
  productosRecibidos(){
    this.productosSeleccionados = this.productoService.getProductosSeleccionados();
    console.log(this.productosRecibidos+"recibidos Imprimir")
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

  

 
  

  listaProducto() {
   this.productoService.listarProductos()
      .subscribe(data => {
        this.producto = data;
        console.log(this.producto+"lista Productos")
      }) 
      
      
  }
 

  //Para guardar la lista
  
  guardarDatosEnAPI1(): void {
   this.productosRecibidos();
    
  
    const catalogos: Catalogo[] = [];
  
    this. productosGuardar.forEach((indicador: any) => {
      // Assuming `Catalogo` class has a constructor that sets the properties
      const cata: Catalogo = new Catalogo();
      cata.productoclas= indicador;
      catalogos.push(cata);
    });
  
    if (catalogos.length === 0) {
      console.warn('No products found to save.');
      return;
    }
  
    this.serviceCatalogo.guardarPonderacionLista(catalogos).subscribe(
      (response: any) => {
        // Manejar la respuesta de la API si es necesario
        console.log(response);
        Swal.fire({
          title: 'Ponderación guardada exitosamente',
          icon: 'success',
          iconColor: '#17550c',
          color: "#0c3255",
          confirmButtonColor: "#0c3255",
          background: "#63B68B",
        });
  
        // Recargar la página después de guardar los datos en la API
        // Add the logic here to reload the page if needed
      },
      (error: any) => {
        // Manejar el error si ocurre alguno
        console.error('Error while saving the products:', error);
        Swal.fire({
          title: 'Error al guardar la ponderación',
          text: 'Ocurrió un error al guardar los datos. Por favor, inténtalo nuevamente.',
          icon: 'error',
          iconColor: '#810c0c',
          color: "#0c3255",
          confirmButtonColor: "#0c3255",
          background: "#B66363",
        });
      }
    );
  }
  
  
  eliminarProducto(item: any) {
    const index = this.productosSeleccionados.indexOf(item);
    if (index !== -1) {
      this.productosSeleccionados.splice(index, 1);
    }
  }
  enviarSeleccionados() {
    this.productosSeleccionados = this.producto.filter((item) => item.seleccionado);
    // Guardar los productos seleccionados en el servicio
    this.productoService.setProductosSeleccionados(this.productosSeleccionados);
    // Navegar al componente OtroComponente
    this.router.navigate(['/catalogo-vista catalogo-vista']);
  }

}

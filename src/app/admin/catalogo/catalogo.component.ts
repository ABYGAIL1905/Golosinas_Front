import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Productos } from 'src/app/models/productos';
import { ProductosService } from 'src/app/service/productos.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Catalogo } from 'src/app/models/catalogo';
import { CatalogoService } from 'src/app/service/catalogo.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {

  guardadoExitoso: boolean = false;
  
  producto: any[] = [];
  dataSource: any;
  produ = new Productos();
  currentPage = 1;
  
  classUser: any;
  public previsualizacion!: string;
  public archivos: any = []
  public loading!: boolean;
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
      
    }

    

    onImageLoad(event: Event) {
      console.log('Imagen cargada:', event);
    }
   
    

  ngOnInit(): void {
    this.listaProducto();
    this.productosRecibidos();
    this.listaCatalogo();
    
  }
  productosRecibidos(){
    this.productosSeleccionados = history.state.seleccionados || [];
    console.log(this.productosSeleccionados+"recibidos");
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
  listaCatalogo() {
    this.serviceCatalogo.listaCatalogo()
       .subscribe(data => {
         this.dataSource = data;
         console.log(this.dataSource+"lista Selecionados")
       }) 
       
       
   }

  //Para guardar la lista

  guardarDatosEnAPI1(): void {
    const catalogos: Catalogo[] = [];

 

     
            // No existen registros en la misma fecha, proceder con la operación de guardado
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

                // Recargar la página después de guardar los datos en la API
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

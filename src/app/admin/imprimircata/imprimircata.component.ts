import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';


import { ToastrService } from 'ngx-toastr';
import { Catalogo } from 'src/app/models/catalogo';
import { Productos } from 'src/app/models/productos';
import { CatalogoService } from 'src/app/service/catalogo.service';
import { ProductosService } from 'src/app/service/productos.service';


import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import  html2canvas from 'html2canvas';

@Component({
  selector: 'app-imprimircata',
  templateUrl: './imprimircata.component.html',
  styleUrls: ['./imprimircata.component.css']
})
export class ImprimircataComponent implements OnInit{
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
  
    this.productosSeleccionados = this.productoService.getReceivedProducts();
    console.log(this.productosSeleccionados + "imprimir");
   
    
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

  imprimirCatalogo() {
    const imprimir = new jsPDF();
  
    // Obtener el contenedor de productos
    const container = document.getElementById('cataimpr') as HTMLElement;
  
    // Obtener todos los elementos de producto
    const productos = container?.querySelectorAll('.u-container-layout-1');
  
    if (productos) {
      productos.forEach((producto: any, index) => {
        html2canvas(producto).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
  
          const imgWidth = imprimir.internal.pageSize.width - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
          imprimir.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
  
          if (index !== productos.length - 1) {
            imprimir.addPage();
          }
  
          if (index === productos.length - 1) {
            imprimir.save('impreso.pdf');
          }
        });
      });
    }
    this.router.navigate(['/productos']);
  }
  
  

 
}

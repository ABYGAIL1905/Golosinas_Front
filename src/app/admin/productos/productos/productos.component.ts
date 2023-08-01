import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Productos } from 'src/app/models/productos';
import { ProductosService } from 'src/app/service/productos.service';



import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit{
  frmProducto: FormGroup;
  guardadoExitoso: boolean = false;
  
  producto: any[] = [];
  produ = new Productos();
  currentPage = 1;
  toastrService: any;
  classUser: any;

  constructor(
    public productoService:ProductosService, 
    private router: Router,
    private fb: FormBuilder
    ) { 
      this.frmProducto = fb.group({
        //codigo_producto: ['', Validators.required],
        foto_producto: ['', [Validators.required]],
        nombre_producto: ['', [Validators.required]]
      })
    }

  ngOnInit(): void {
    this.listaProducto();
  }

  //Almacenar en el objeto
  async subirFoto(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    console.log('Tamaño de la foto en bytes:', fileSize);
    if (fileSize > 262144) {
      this.toastrService.error('La foto es muy pesada.', 'FOTO PESADA.');
      // alert('La foto es muy pesada');
      event.target.value = null;
    } else {
      try {
        this.classUser.foto_producto = await this.convertToBase64(file);
        console.log('Foto convertida a Base64:', this.classUser.foto_producto);
      } catch (error) {
        console.error(error);
        
      }
    }
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
  

  listaProducto() {
   this.productoService.listarProductos()
      .subscribe(data => {
        this.producto = data;
        console.log(this.producto+"listaaaa")
      }) 
      
  }

 

 /* eliminar(producto: Productos): void {

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
          // Swal.fire({
          //   title: 'Producto Eliminado éxitosamente',
          //   icon: 'success',
          //   iconColor :'#17550c',
          //   color: "#0c3255",
          //   confirmButtonColor:"#0c3255",
          //   background: "#63B68B",
          // })
          //alert("Se elimino...!!")
          Swal.fire(
            'Borrado!',
                'Su archivo ha sido borrado.',
                'success'
          )
        });
            //FIN DEL CODIGO A EJECUTAR
       
      }
    })
    

  }*/

}

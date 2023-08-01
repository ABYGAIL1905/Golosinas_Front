import { Categoria } from "./categoria";

export class Productos {
    id_producto!:number;
    codigo_producto:string="";
    foto_producto:string="";
    nombre_producto:string="";
    unidad_caja:number=0;
    precio_distribuidor:number=0;
    precio_mayor3:number=0;
    precio_detallista:number=0;  
    precio_venta_publico:number=0;
    categoria:Categoria| null = null;
    estado_producto :string="";
    
}

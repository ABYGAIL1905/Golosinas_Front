import { Productos } from "./productos";

export class Catalogo {
    id_catalogo ! :number;
    nombre_catalogo: string="";
    productoclas: Productos | null = null;
}

export interface Product {
    id: number;
    nombre: string;
    codigoBarras: string;
    descripcion: string;
    precio: number;
    cantidadStock: number;
  }


  export interface ApiResponse<T> {
    message: string;
    data: T;
    code: number;
  }
  
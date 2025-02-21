'use client';
import { 
  TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, TableSortLabel, CircularProgress, Paper, Button
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  orderBy: keyof Product;
  order: 'asc' | 'desc';
  onSort: (property: keyof Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  loading,
  orderBy,
  order,
  onSort,
  onEdit,
  onDelete
}: ProductTableProps) {

  const productList = Array.isArray(products) ? products : [];


  const sortedProducts = [...productList].sort((a, b) => {
    console.log('Products received ordenados:', productList);
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            {['nombre', 'codigoBarras', 'descripcion', 'precio', 'cantidadStock', 'acciones'].map((header) => (
              <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                {header !== 'acciones' ? (
                  <TableSortLabel
                    active={orderBy === header}
                    direction={orderBy === header ? order : 'asc'}
                    onClick={() => onSort(header as keyof Product)}
                  >
                    {header.toUpperCase()}
                  </TableSortLabel>
                ) : 'ACCIONES'}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.codigoBarras}</TableCell>
                <TableCell>{product.descripcion}</TableCell>
                <TableCell align="right">${product.precio}</TableCell>
                <TableCell align="right">{product.cantidadStock}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => onEdit(product)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </Button>
                  <Button
                    color="error"
                    onClick={() => onDelete(product.id)}
                  >
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No hay productos disponibles.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

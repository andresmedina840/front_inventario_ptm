"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axiosClient from "./axios/axiosClient";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import { Product } from "./types";
import Image from "next/image";

export default function ProductCRUDPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState<keyof Product>("nombre");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosClient.get<{ data: Product[] }>(
          "/productos"
        );
        const productsWithNumberId = response.data.data.map((p) => ({
          ...p,
          id: Number(p.id),
        }));
        setProducts(productsWithNumberId);
      } catch (error) {
        showSnackbar(`Error cargando productos ${error}`, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSort = useCallback(
    (property: keyof Product) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [orderBy, order]
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosClient.delete(`/productos/${id}`);
      setProducts(products.filter((p) => p.id !== id));

      if (response.data.code === 0) {
        showSnackbar(response.data.message, "success");
      }
    } catch (error) {
      showSnackbar(`Error eliminando producto ${error}`, "error");
    }
  };

  const handleUpdateProducts = (newProduct: Product, isEdit: boolean) => {
    if (isEdit) {
      setProducts(
        products.map((p) => (p.id === newProduct.id ? newProduct : p))
      );
    } else {
      setProducts([...products, newProduct]);
    }
  };

  const totalInventario = products.reduce(
    (sum, product) => sum + product.precio * product.cantidadStock,
    0
  );
  const productoMayorValor = products.reduce(
    (max, product) =>
      product.precio * product.cantidadStock > max.precio * max.cantidadStock
        ? product
        : max,
    products[0] || { nombre: "N/A", precio: 0, cantidadStock: 0 }
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Gestión de Carlos Inventarios de Productos de PTM
        </Typography>
        <Image
          src="/Logo_COMERCIAL-CARD.png"
          alt="Logo Comercial"
          width={400}
          height={150}
          priority
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Valor Total del Inventario: ${totalInventario.toFixed(2)}
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Producto con Mayor Valor: {productoMayorValor.nombre} ($
        {(productoMayorValor.precio * productoMayorValor.cantidadStock).toFixed(
          2
        )}
        )
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedProduct(null);
            setOpenForm(true);
          }}
        >
          Nuevo Producto
        </Button>

        <Button
          variant="outlined"
          startIcon={<Search />}
          onClick={() => router.push("/combinaciones")}
        >
          Buscar Combinaciones
        </Button>
      </Box>
      <ProductTable
        products={products}
        loading={loading}
        orderBy={orderBy}
        order={order}
        onSort={handleSort}
        onEdit={(product) => {
          setSelectedProduct(product);
          setOpenForm(true);
        }}
        onDelete={handleDelete}
      />

      <ProductForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={handleUpdateProducts}
        showSnackbar={showSnackbar}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

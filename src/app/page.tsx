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
import { Add } from "@mui/icons-material";
import axiosClient from "./axios/axiosClient";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import { Product } from "./types";

export default function ProductCRUDPage() {
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
          id: Number(p.id), // Convertir id a número
        }));
        setProducts(productsWithNumberId);
      } catch (error) {
        showSnackbar("Error cargando productos", "error");
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
      showSnackbar("Error eliminando producto", "error");
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

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Gestión de Productos de PTM
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpenForm(true)}
        sx={{ mb: 3 }}
      >
        Nuevo Producto
      </Button>

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

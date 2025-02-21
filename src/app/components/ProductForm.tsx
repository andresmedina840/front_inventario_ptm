"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormHelperText,
} from "@mui/material";
import axiosClient from "../axios/axiosClient";
import { ApiResponse, Product } from "./../types";
import CustomTextField from "./personalizados/CustomTextField";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: (product: Product, isEdit: boolean) => void;
  showSnackbar: (message: string, severity: "success" | "error") => void;
}

export default function ProductForm({
  open,
  onClose,
  product,
  onSuccess,
  showSnackbar,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    codigoBarras: "",
    descripcion: "",
    precio: 0,
    cantidadStock: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        codigoBarras: product.codigoBarras,
        descripcion: product.descripcion,
        precio: product.precio,
        cantidadStock: product.cantidadStock,
      });
    } else {
      setFormData({
        nombre: "",
        codigoBarras: "",
        descripcion: "",
        precio: 0,
        cantidadStock: 0,
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim())
      newErrors.nombre = "Nombre del producto es requerido";
    if (!formData.codigoBarras.trim())
      newErrors.codigoBarras = "Código de barras es requerido";
    if (formData.precio <= 0) newErrors.precio = "Precio debe ser mayor a 0";
    if (formData.cantidadStock < 0)
      newErrors.cantidadStock = "Stock no puede ser negativo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let response;
      if (product?.id) {
        response = await axiosClient.put<ApiResponse<Product>>(
          `/productos/${product.id}`,
          formData
        );

        console.log("Andres actualizar pro: ", response.data.message);

        if (response.data.code === 0) {
          showSnackbar(response.data.message, "success");
        }
      } else {
        response = await axiosClient.post<ApiResponse<Product>>(
          `/productos`,
          formData
        );
        if (response.data.code === 0) {
          showSnackbar(response.data.message, "success");
        }
      }

      // Asegurar que el ID es número
      const updatedProduct = {
        ...response.data.data, // Accede a `data`, que sí contiene el producto
        id: Number(response.data.data.id),
      };

      onSuccess(updatedProduct, !!product);
      onClose();
    } catch (error) {
      showSnackbar("Error guardando producto", "error");
    }
  };

  const commonTextFieldProps = {
    slotProps: {
      htmlInput: {
        suppressHydrationWarning: true,
        spellCheck: false,
        "data-ms-editor": "false",
      },
    },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {product ? "Editar Producto" : "Nuevo Producto"}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <CustomTextField
          label="Nombre del producto"
          name="nombre"
          value={formData.nombre || ""}
          onChange={(e) => {
            setFormData({ ...formData, nombre: e.target.value });
            if (errors.nombre) {
              setErrors({ ...errors, nombre: "" });
            }
          }}
          helperText={
            errors.nombre || `${(formData.nombre || "").length} / 50 caracteres`
          }
          slotProps={{
            htmlInput: {
              maxLength: 50,
              ...commonTextFieldProps.slotProps.htmlInput,
            },
          }}
          error={!!errors.nombre}
        />

        <CustomTextField
          margin="normal"
          label="Codigo de barras del producto"
          name="codigoBarras"
          value={formData.codigoBarras || ""}
          onChange={(e) => {
            setFormData({ ...formData, codigoBarras: e.target.value });
            if (errors.codigoBarras) {
              setErrors({ ...errors, codigoBarras: "" });
            }
          }}
          helperText={
            errors.codigoBarras ||
            `${(formData.codigoBarras || "").length} / 50 caracteres`
          }
          slotProps={{
            htmlInput: {
              maxLength: 50,
              ...commonTextFieldProps.slotProps.htmlInput,
            },
          }}
          error={!!errors.codigoBarras}
        />

        <CustomTextField
          margin="normal"
          label="Descripción"
          name="descripcion"
          multiline
          rows={3}
          value={formData.descripcion || ""}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          helperText={`${(formData.descripcion || "").length} / 300 caracteres`}
          slotProps={{
            htmlInput: {
              maxLength: 300,
              ...commonTextFieldProps.slotProps.htmlInput,
            },
          }}
        />
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <CustomTextField
            name="precio"
            label="Precio"
            type="text"
            value={formData.precio.toString()}
            onChange={(e) => {
              const newValue = e.target.value
                .replace(/[^0-9]/g, "")
                .slice(0, 15);
              if (/^\d*$/.test(newValue)) {
                setFormData({
                  ...formData,
                  precio: newValue === "" ? 0 : parseInt(newValue),
                });

                if (errors.precio) {
                  setErrors({});
                }
              }
            }}
            error={!!errors.precio}
            helperText={
              errors.precio ||
              `${formData.precio.toString().length} / 15 caracteres`
            }
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "^\\d*$",
                title: "Solo números enteros",
              },
            }}
          />

          <CustomTextField
            name="cantidadStock"
            label="Stock"
            type="text"
            value={formData.cantidadStock.toString()}
            onChange={(e) => {
              const newValue = e.target.value
                .replace(/[^0-9]/g, "")
                .slice(0, 4);
              if (/^\d*$/.test(newValue)) {
                setFormData({
                  ...formData,
                  cantidadStock: newValue === "" ? 0 : parseInt(newValue),
                });
              }
            }}
            error={!!errors.cantidadStock}
            helperText={
              errors.cantidadStock ||
              `${formData.cantidadStock.toString().length} / 4 caracteres`
            }
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "^\\d*$",
                title: "Solo números enteros",
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axiosClient from "../axios/axiosClient";
import { useRouter } from "next/navigation";
import CustomTextField from "../components/personalizados/CustomTextField";
import Image from "next/image";

export default function CombinacionesPage() {
  const [formData, setFormData] = useState({ precio: 0 });
  const [combinaciones, setCombinaciones] = useState<[string[], number][]>([]);
  const [errors, setErrors] = useState<{ precio?: string }>({});
  const [catFacts, setCatFacts] = useState<string[]>([]);
  const [uselessFact, setUselessFact] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCatFacts = async () => {
      try {
        const response = await fetch(
          "https://meowfacts.herokuapp.com/?count=2&lang=esp"
        );
        const data = await response.json();
        setCatFacts(data.data);
        setOpenDialog(true);
      } catch (error) {
        console.error("Error obteniendo datos sobre gatos", error);
      }
    };

    const fetchUselessFact = async () => {
      try {
        const response = await fetch(
          "https://uselessfacts.jsph.pl/api/v2/facts/today?language=en"
        );
        const data = await response.json();
        setUselessFact(data.text);
      } catch (error) {
        console.error("Error obteniendo el dato inútil del día", error);
      }
    };

    fetchCatFacts();
    fetchUselessFact();
  }, []);

  const handleBuscar = async () => {
    if (formData.precio <= 0) {
      setErrors({ precio: "Ingrese un valor mayor a 0" });
      return;
    }

    try {
      const response = await axiosClient.get(
        `/productos/combinaciones/${formData.precio}`
      );
      console.log("fsfsfdsf: ", response.data.data);
      setCombinaciones(response.data.data);
    } catch (err) {
      setErrors({ precio: `Error al obtener combinaciones ${err}` });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Sabías que...</DialogTitle>
        <DialogContent>
          {catFacts.map((fact, index) => (
            <Typography key={index} sx={{ mb: 1 }}>
              • {fact}
            </Typography>
          ))}
        </DialogContent>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Buscar Combinaciones de Productos
        </Typography>
        <Image
          src="/Logo_COMERCIAL-CARD.png"
          alt="Logo Comercial"
          width={400}
          height={150}
          priority
        />
      </Box>

      <CustomTextField
        name="precio"
        label="Ingrese un valor a buscar las combinaciones"
        type="text"
        value={formData.precio.toString()}
        onChange={(e) => {
          const newValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 15);
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
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={handleBuscar}>
          Buscar
        </Button>

        <Button variant="outlined" onClick={() => router.push("/")}>
          Volver
        </Button>
      </Box>
      {combinaciones.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Productos
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Suma
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {combinaciones.map((combo, index) => (
                <TableRow key={index}>
                  <TableCell>{combo[0].join(", ")}</TableCell>
                  <TableCell>${combo[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {uselessFact && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "white",
            p: 2,
            textAlign: "center",
            borderTop: "1px solid #ddd",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Dato inútil del día:
          </Typography>
          <Typography>{uselessFact}</Typography>
        </Box>
      )}
    </Box>
  );
}

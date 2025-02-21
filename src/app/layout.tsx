"use client";

import { ThemeProvider } from '@mui/material/styles'; // Importación corregida
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import theme from './theme/theme';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}> {/* Componente actualizado */}
          <CssBaseline />
          <SnackbarProvider maxSnack={3} autoHideDuration={4000}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              {children}
            </LocalizationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
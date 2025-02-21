// utils/dateUtils.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// Extender dayjs con plugin UTC
dayjs.extend(utc);

export const getCurrentDateISO = (): string => {
  // Usar UTC para consistencia entre servidor y cliente
  return dayjs.utc().format("YYYY-MM-DD");
};

// Nueva función para formatear fechas existentes
export const formatDateToISO = (date: string | Date): string => {
  return dayjs.utc(date).isValid() 
    ? dayjs.utc(date).format("YYYY-MM-DD") 
    : "";
};

// Función para obtener fecha máxima en formato dayjs (UTC)
export const getCurrentDayjsUTC = () => {
  return dayjs.utc();
};
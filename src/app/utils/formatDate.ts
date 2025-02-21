export const formatDate = (date: string): string => {
    const parsedDate = new Date(date);
    const day = parsedDate.getDate().toString().padStart(2, '0'); // Asegura dos dígitos para el día
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Asegura dos dígitos para el mes
    const year = parsedDate.getFullYear().toString(); // Obtiene el año
  
    return `${day}/${month}/${year}`;
  };
  
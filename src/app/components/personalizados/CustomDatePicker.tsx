"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import React from "react";

type CustomDatePickerProps = {
  label: string;
  name: string;
  value: string | null;
  handleChange: (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
  maxDate?: string; // Opcional, por si quieres limitar la fecha máxima
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  name,
  value,
  handleChange,
  maxDate,
}) => {
  return (
    <DatePicker
      label={label}
      value={value && dayjs(value).isValid() ? dayjs(value) : null}
      onChange={(newValue) => {
        const event = {
          target: {
            name,
            value: newValue ? newValue.format("YYYY-MM-DD") : "",
          },
        } as unknown as React.ChangeEvent<{ name?: string; value: unknown }>;
        handleChange(event);
      }}
      maxDate={maxDate ? dayjs(maxDate) : undefined}
      slotProps={{
        textField: {
          fullWidth: true,
          inputProps: { spellCheck: false },
          InputLabelProps: { shrink: true },
        },
      }}
      format="DD/MM/YYYY"
    />
  );
};

export default CustomDatePicker;

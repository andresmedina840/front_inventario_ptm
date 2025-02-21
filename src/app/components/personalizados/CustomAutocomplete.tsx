// components/personalizados/CustomAutocomplete.tsx
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React from "react";

interface CustomAutocompleteProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  loading?: boolean;
  label: string;
  getOptionLabel?: (option: T) => string;
  disabled?: boolean;
  required?: boolean;
}

const CustomAutocomplete = <T extends {}>({
  options,
  value,
  onChange,
  loading = false,
  label,
  getOptionLabel = (option: T) => String(option),
  disabled = false,
  required = false,
}: CustomAutocompleteProps<T>) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      loading={loading}
      disabled={disabled}
      isOptionEqualToValue={(option, value) =>
        getOptionLabel(option) === getOptionLabel(value)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          fullWidth
          slotProps={{
            input: {
              ...params.InputProps, // Asegura que todas las props se mantengan
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps?.endAdornment}
                </>
              ),
            },
            inputLabel: { shrink: true },
          }}
        />
      )}
    />
  );
};

export default CustomAutocomplete;

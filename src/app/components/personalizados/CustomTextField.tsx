// components/personalizados/CustomTextField.tsx
import { TextField } from "@mui/material";
import React from "react";

type CustomTextFieldProps = {
  uppercase?: boolean;
  fullWidth?: boolean;
  slotProps?: {
    htmlInput?: React.InputHTMLAttributes<HTMLInputElement> & {
      suppressHydrationWarning?: boolean;
      "data-ms-editor"?: string;
    };
  };
} & React.ComponentProps<typeof TextField>;

const CustomTextField = (props: CustomTextFieldProps) => {
  const { 
    uppercase, 
    fullWidth = true,
    slotProps = {}, 
    ...rest 
  } = props;

  const mergedSlotProps = {
    htmlInput: {
      suppressHydrationWarning: true,
      spellCheck: false,
      "data-ms-editor": "false",
      style: {
        textTransform: uppercase ? "uppercase" : "none",
        ...slotProps?.htmlInput?.style,
      },
      ...slotProps?.htmlInput,
    } as React.InputHTMLAttributes<HTMLInputElement> & { 
      "data-ms-editor"?: string 
    },
    
    inputLabel: {
      shrink: true,
      ...slotProps?.inputLabel,
    },
    ...slotProps,
  };

  return (
    <TextField 
      {...rest}
      fullWidth={fullWidth}
      slotProps={mergedSlotProps}
      value={rest.value || ""}
    />
  );
};

export default CustomTextField;
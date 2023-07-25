import { FC, memo } from "react";
import { useController } from "react-hook-form";
import { TextField, Typography } from "@mui/material";

export interface FromInputProps {
  name: string;
  label: string;
  required?: boolean;
  multi?: boolean;
  className?: string;
}
// eslint-disable-next-line react/display-name
export const FormInput: FC<FromInputProps> = memo(
  ({ name, label, required = false, multi = false, className = "" }) => {
    const {
      field: { onChange, value },
      fieldState: { error },
    } = useController({
      name,
      rules: required ? { required: "Обязательное поле" } : undefined,
    });

    return (
      <>
        <TextField
          {...(multi
            ? { multiline: true, rows: 3, variant: "filled" }
            : { variant: "standard" })}
          className={className}
          label={label}
          onChange={onChange}
          value={value ?? ""}
        />
        {!!error && <Typography color="#F7685B">{error.message}</Typography>}
      </>
    );
  }
);

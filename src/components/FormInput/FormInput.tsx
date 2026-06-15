import { FC, memo, useCallback } from "react";
import { useController } from "react-hook-form";
import { TextField, Typography } from "@mui/material";

export interface FromInputProps {
  name: string;
  label: string;
  required?: boolean;
  multi?: boolean;
  className?: string;
  autoFocus?: boolean;
  numeric?: boolean;
}
// eslint-disable-next-line react/display-name
export const FormInput: FC<FromInputProps> = memo(
  ({
    name,
    label,
    required = false,
    multi = false,
    className = "",
    autoFocus = false,
    numeric = false,
  }) => {
    const {
      field: { onChange, value },
      fieldState: { error },
    } = useController({
      name,
      rules: required ? { required: "Обязательное поле" } : undefined,
    });

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (String(value) === "0") {
          onChange("");
        }
        e.target.select();
      },
      [value, onChange]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (numeric) {
          const cleaned = e.target.value.replace(/[^0-9]/g, "");
          if (cleaned !== e.target.value) {
            onChange(cleaned);
            return;
          }
        }
        onChange(e);
      },
      [numeric, onChange]
    );

    return (
      <>
        <TextField
          {...(multi
            ? { multiline: true, rows: 3, variant: "filled" }
            : { variant: "standard" })}
          className={className}
          label={label}
          onChange={handleChange}
          onFocus={handleFocus}
          value={value ?? ""}
          autoFocus={autoFocus}
          inputProps={numeric ? { inputMode: "numeric" as "text" } : undefined}
        />
        {!!error && <Typography color="#F7685B">{error.message}</Typography>}
      </>
    );
  }
);

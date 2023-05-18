import { FC, SyntheticEvent, useCallback } from "react";
import { useController } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";

export interface ComboBoxProps {
  name: string;
  label: string;
  required?: boolean;
  options: ComboBoxOption[];
  multi?: boolean;
}

export interface ComboBoxOption {
  id: string;
  label: string;
  value: string;
}

export const FormComboBox: FC<ComboBoxProps> = ({
  name,
  label,
  required = false,
  options,
  multi = false,
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    rules: required ? { required: "Обязательное поле" } : undefined,
  });

  const handleChange = useCallback(
    (
      _: SyntheticEvent<Element, Event>,
      newValue: ComboBoxOption | null | ComboBoxOption[]
    ) => {
      // если комбобокс с множественным выбором, то value будет массивом
      if (multi && Array.isArray(newValue)) {
        onChange(newValue);
        // если комбобокс с одинарным выбором, то value будет объектом
      } else if (!Array.isArray(newValue)) {
        onChange(options.find(({ id }) => newValue?.id === id));
      }
    },
    [multi, onChange, options]
  );

  return (
    <>
      <Autocomplete
        {...(multi ? { multiple: true, value } : { value })}
        onChange={handleChange}
        isOptionEqualToValue={(option, v) => option?.id === v?.id}
        disablePortal
        options={options}
        disableClearable
        renderInput={(params) => <TextField {...params} label={label} />}
      />
      {!!error && <Typography color="#F7685B">{error.message}</Typography>}
    </>
  );
};

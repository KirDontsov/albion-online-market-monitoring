import { FC } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const AVAILABLE_TIERS = ["2", "3", "4", "5"];

interface TierFilterProps {
  value: string[];
  onChange: (tiers: string[]) => void;
}

export const TierFilter: FC<TierFilterProps> = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      value={value}
      onChange={(_, v) => onChange(v)}
      size="small"
      sx={{ flexShrink: 0 }}
    >
      {AVAILABLE_TIERS.map((t) => (
        <ToggleButton key={t} value={t} sx={{ px: 1.5, py: 0.25, textTransform: "none" }}>
          T{t}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

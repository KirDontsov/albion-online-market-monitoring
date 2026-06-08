import { FC, ReactNode } from "react";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

export interface MuiThemeProviderProps {
  children?: ReactNode | ReactNode[];
}

let theme = createTheme();
theme = responsiveFontSizes(theme);

theme.typography.h1 = {
  [theme.breakpoints.up("md")]: {
    fontSize: "1.4rem",
    fontWeight: "300",
  },
};

const THEME = createTheme({
  ...theme,
  palette: {
    mode: "dark",
    primary: {
      main: "#7c6bf0",
      contrastText: "#fff",
    },
    success: {
      main: "#26d97f",
      contrastText: "#fff",
    },
    error: {
      main: "#f06050",
      contrastText: "#fff",
    },
    warning: {
      main: "#f5a623",
      contrastText: "#fff",
    },
    info: {
      main: "#5b9bd5",
      contrastText: "#fff",
    },
    secondary: {
      main: "#7c6bf0",
    },
    background: {
      default: "#111320",
      paper: "#181a2a",
    },
    text: {
      primary: "#e0e0e8",
      secondary: "#8a8ca0",
    },
    divider: "rgba(255,255,255,0.06)",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "10px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          transition: "background 0.15s ease",
        },
        sizeMedium: {
          padding: "10px 10px",
        },
        sizeSmall: {
          padding: "6px 10px",
          border: "none",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontWeight: 600,
            color: "#8a8ca0",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            whiteSpace: "nowrap",
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: "9.25px 34px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          height: "56px",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(124,107,240,0.3)",
          },
        },
        sizeSmall: {
          height: "24px",
        },
        containedSuccess: {
          backgroundColor: "#26d97f",
          color: "#fff",
        },
        containedError: {
          backgroundColor: "#f06050",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          backgroundColor: "#181a2a",
          backgroundImage: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#e0e0e8",
          transition: "color 0.15s ease",
          "&:hover": {
            color: "#7c6bf0",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        },
      },
    },
  },
});

export const MuiThemeProvider: FC<MuiThemeProviderProps> = ({ children }) => {
  return <ThemeProvider theme={THEME}>{children}</ThemeProvider>;
};

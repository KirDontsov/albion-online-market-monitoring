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
      main: "#885AF8",
      contrastText: "#fff",
    },
    success: {
      main: "#2ED47A",
      contrastText: "#fff",
    },
    error: {
      main: "#F7685B",
      contrastText: "#fff",
    },
    secondary: {
      main: "#885AF8",
    },
    background: {
      default: "#242526",
      paper: "#242526",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "8px 8px",
        },
        sizeMedium: {
          padding: "8px 8px",
        },
        sizeSmall: {
          padding: "4px 8px",
          border: "none",
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
        },
        sizeSmall: {
          height: "24px",
        },
        containedSuccess: {
          backgroundColor: "#2ED47A",
          color: "#fff",
        },
        containedError: {
          backgroundColor: "#F7685B",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "6px 0 18px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#fff",
          ":hover": "#885AF8",
        },
      },
    },
  },
});

export const MuiThemeProvider: FC<MuiThemeProviderProps> = ({ children }) => {
  return <ThemeProvider theme={THEME}>{children}</ThemeProvider>;
};

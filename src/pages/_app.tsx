import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0d1421",
    },
    primary: {
      main: "#6188ff",
    },
    secondary: {
      main: "#fff",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        sx: {
          textTransform: "none",
        },
      },
    },
    MuiDivider: {
      defaultProps: {
        sx: {
          borderColor: "#323546",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#0d1421",
          boxShadow: "none",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: 80,
        },
      },
    },
  },
});
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

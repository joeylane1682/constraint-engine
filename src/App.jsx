import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LayoutViewWithRef } from "./layout/LayoutRenderer";
import { dashboardLayout } from "./layout/templates/dashboard";
import "./App.css";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LayoutViewWithRef tree={dashboardLayout} />
    </ThemeProvider>
  );
}

export default App

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LayoutViewWithRef } from "./layout/LayoutRenderer";
import { dashboardLayout } from "./layout/templates/dashboard";
import { appShellLayout } from "./layout/templates/appShell";
import "./App.css";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LayoutViewWithRef tree={appShellLayout} />
    </ThemeProvider>
  );
}

export default App

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LayoutViewWithRef } from "./layout/LayoutRenderer";
import {
  applicationPageRegions,
  applicationPageTree,
} from "./pages/application-page";
import theme from "./theme";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LayoutViewWithRef
        tree={applicationPageTree}
        regions={applicationPageRegions}
      />
    </ThemeProvider>
  );
}

export default App

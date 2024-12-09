// src/theme.js

import { createTheme } from "@mui/material/styles";

const theme = createTheme({

  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    
  },
  
  palette: {
    primary: {
      main: "#6e8efb",
    },
    secondary: {
      main: "#a777e3",
    },
  },
});

export default theme;

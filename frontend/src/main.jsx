import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: (props) => ({
    body: {
      // dark_mode, light_mode
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', '#101010')(props),
    }
  })
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#e1e1e1"
  }
};

const theme = extendTheme({ config, styles, colors});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)

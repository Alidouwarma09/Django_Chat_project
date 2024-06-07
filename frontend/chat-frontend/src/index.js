import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from "./theme";
import PullToRefresh from "./compoment/PullRefresh";

const root = ReactDOM.createRoot(document.getElementById('root'));
const refreshFunction = async () => {
    // Ajoutez ici votre logique de rafraîchissement, par exemple, recharger les données depuis une API
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simuler un délai
};
root.render(
  <React.StrictMode>

      <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <PullToRefresh onRefresh={refreshFunction}>
              <App />
          </PullToRefresh>
      </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

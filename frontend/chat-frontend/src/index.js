import React, {useEffect, useState} from 'react';
import {ChakraProvider, ColorModeScript, useToast} from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from "./theme";
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));
const ConnectionStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [connectionSpeed, setConnectionSpeed] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
            if (!navigator.onLine) {
                toast({
                    title: 'Vous êtes hors ligne.',
                    description: 'Veuillez vérifier votre connexion internet.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Vous êtes en ligne.',
                    description: 'Connexion rétablie.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, [toast]);

    useEffect(() => {
        const checkConnectionSpeed = () => {
            const startTime = new Date().getTime();
            fetch('https://www.google.com/images/phd/px.gif') // Teste le téléchargement d'une petite image
                .then(() => {
                    const endTime = new Date().getTime();
                    const duration = endTime - startTime;
                    setConnectionSpeed(duration);
                    if (duration > 2000) { // Si le temps de téléchargement est supérieur à 2 secondes, considérer la connexion comme lente
                        toast({
                            title: 'Connexion lente détectée.',
                            description: 'Votre connexion internet semble être lente.',
                            status: 'warning',
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                })
                .catch(() => {
                    setConnectionSpeed(null);
                });
        };

        const interval = setInterval(checkConnectionSpeed, 10000); // Vérifie la vitesse de connexion toutes les 10 secondes

        return () => clearInterval(interval);
    }, [toast]);

    return null;
};


root.render(
  <React.StrictMode>

      <ChakraProvider theme={theme}>²
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
      </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.register();

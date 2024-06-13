import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const styles = {
    global: (props) => ({
        body: {
            bg: mode('white', 'gray.800')(props),
            color: mode('gray.800', 'white')(props),
        },
        html: {
            bg: mode('white', 'gray.800')(props),
            color: mode('gray.800', 'white')(props),
        },
        '.navbar': {
            bg: props.colorMode === 'dark' ? 'gray.900' : '#f5f5f5',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        '.sidebar': {
            bg: props.colorMode === 'dark' ? 'gray.900' : '#f5f5f5',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        '.conversation': {
            bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        '.navbarBublication': {
            bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        '.bottom-tab': {
            bg: props.colorMode === 'dark' ? 'gray.800' : '#f5f5f5',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
    }),
};

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
};

const theme = extendTheme({ config, styles });

export default theme;

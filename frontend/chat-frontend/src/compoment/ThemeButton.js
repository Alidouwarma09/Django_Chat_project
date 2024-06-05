import React from 'react';
import { useColorMode, useColorModeValue, Button } from '@chakra-ui/react';

function ThemeButton() {
    const { colorMode, toggleColorMode } = useColorMode();
    const buttonBg = useColorModeValue('gray.300', 'gray.700');

    return (
        <header>
            <Button onClick={toggleColorMode} bg={buttonBg}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
            </Button>
        </header>
    );
}

export default ThemeButton;

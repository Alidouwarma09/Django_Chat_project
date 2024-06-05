import React from 'react';
import { useColorMode, Switch } from '@chakra-ui/react';

function ThemeButton() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Switch
            isChecked={colorMode === 'dark'}
            onChange={toggleColorMode}
            colorScheme="teal"
        />
    );
}

export default ThemeButton;

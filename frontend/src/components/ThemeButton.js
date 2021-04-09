import {IconButton, useColorMode} from '@chakra-ui/react'
import {MoonIcon, SunIcon} from '@chakra-ui/icons';

function ThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <IconButton icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </IconButton>
    </header>
  )
}

export default ThemeButton
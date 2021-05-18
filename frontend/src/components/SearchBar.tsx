import { useState } from "react";
import {
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Input,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import Politicians from "./Politicians";

const SearchBar = () => {
  const [link, setLink] = useState("");

  const history = useHistory();

  const redirect = () => {
    history.push("/politicians/tweety/s=" + link + "?");
    history.go(0);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <form onSubmit={redirect}>
        <HStack>
          <Input
            type="text"
            w={useBreakpointValue({ xl: "10vw", xs: "90%" })}
            id="header-search"
            placeholder="Szukaj"
            onChange={(e) => setLink(e.target.value)}
            onClick={onOpen}
          />
          <IconButton
            aria-label="Search database"
            icon={<SearchIcon />}
            onClick={redirect}
          />
        </HStack>
      </form>
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Wyszukaj</DrawerHeader>
          <DrawerBody>
            <Center>
              <Input
                type="text"
                w={useBreakpointValue({ xl: "10vw", xs: "90%" })}
                id="header-search"
                placeholder="Szukaj"
                onChange={(e) => setLink(e.target.value)}
                onClick={onOpen}
                m="3"
              />
            </Center>
            <Politicians />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchBar;

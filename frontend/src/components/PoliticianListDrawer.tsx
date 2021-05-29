import { IconButton } from "@chakra-ui/button";
import { AddIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import Politicians from "./Politicians";

const PoliticianListDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        icon={<AddIcon />}
        onClick={onOpen}
        aria-label="Pick politician"
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Wybierz polityka</DrawerHeader>
          <DrawerBody>
            <Politicians />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PoliticianListDrawer;

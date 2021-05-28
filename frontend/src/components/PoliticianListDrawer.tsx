import { Button } from "@chakra-ui/button";
import { ViewIcon } from "@chakra-ui/icons";
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
      <Button leftIcon={<ViewIcon />} onClick={onOpen} />
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

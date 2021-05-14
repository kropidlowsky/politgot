import { Button } from "@chakra-ui/button";
import { HStack, Text } from "@chakra-ui/layout";
import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { Link } from "@chakra-ui/react";

const Copyright = () => {
  return (
    <HStack mt="10">
      <Link
        href="https://github.com/kropidlowsky/politgot"
        _hover={{ color: "white" }}
      >
        <Button _hover={{ bg: "red.500" }} leftIcon={<AiFillGithub />}>
          Open in Github
        </Button>
      </Link>
      <Text fontFamily="Gugi">{new Date().getFullYear()} - Politgot</Text>
    </HStack>
  );
};

export default Copyright;

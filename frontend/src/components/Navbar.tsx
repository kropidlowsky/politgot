import {
  Center,
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import ThemeButton from "./ThemeButton";

import SearchBar from "./SearchBar";
export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box
      position="fixed"
      w="99vw"
      zIndex="1"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="lg"
    >
      <Flex
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={0}
        borderStyle={"solid"}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Center>
            <Link
              href="/"
              textAlign={useBreakpointValue({ base: "center", md: "left" })}
              fontFamily={"Gugi"}
              fontSize={"4xl"}
              _hover={{ color: "red.500" }}
            >
              PolitGot
            </Link>
          </Center>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <ThemeButton />
          {useBreakpointValue({ xl: <SearchBar /> })}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Center>
                <Link
                  p={5}
                  href={navItem.href ?? "#"}
                  fontSize={"xl"}
                  fontWeight={500}
                  _hover={{
                    textDecoration: "none",
                    color: "red.500",
                  }}
                >
                  {navItem.label}
                </Link>
              </Center>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href ?? ""}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: "red.400" }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "white" }}
            fontWeight={500}
            fontSize={"lg"}
            align={"center"}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"white"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack p={4} display={{ md: "none" }}>
      <SearchBar />
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? ""}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600}>{label}</Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Politycy",
    href: "/politicians",
  },
  {
    label: "Partie",
    href: "/parties",
  },
  {
    label: "Głosowania",
    href: "/polls",
  },
  {
    label: "Przemowy",
    href: "/speeches",
  },
  {
    label: "O nas",
    href: "#",
  },
];

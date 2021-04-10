import {
    Avatar,
    Box,
    chakra,
    Container,
    Flex,
    Icon,
    SimpleGrid,
    useColorModeValue,
    Skeleton
  } from '@chakra-ui/react';
  
  const testimonials = [
    {
      name: 'Brandon P.',
      role: 'Chief Marketing Officer',
      content:
        'It really saves me time and effort. It is exactly what our business has been lacking. EEZY is the most valuable business resource we have EVER purchased. After using EEZY my business skyrocketed!',
      avatar:
        'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
    },
    {
      name: 'Krysta B.',
      role: 'Entrepreneur',
      content:
        "I didn't even need training. We've used EEZY for the last five years. I have gotten at least 50 times the value from EEZY. I made back the purchase price in just 48 hours!",
      avatar:
        'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
    },
    {
      name: 'Darcy L.',
      role: 'Movie star',
      content:
        "Thank you for making it painless, pleasant and most of all, hassle free! I'm good to go. No matter where you go, EEZY is the coolest, most happening thing around! I love EEZY!",
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80',
    },
    {
      name: 'Daniel T.',
      role: 'Musician',
      content:
        'I am so pleased with this product. EEZY is both attractive and highly adaptable. Without EEZY, we would have gone bankrupt by now. Thank you for creating this product!',
      avatar:
        'https://images.unsplash.com/photo-1606513542745-97629752a13b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
    },
  ];
  
  interface TestimonialCardProps {
    name: string;
    role: string;
    content: string;
    avatar: string;
    index: number;
  }
  
  function TestmonialCard(props: TestimonialCardProps) {
    const { name, role, content, avatar, index } = props;
    return (
      <Skeleton isLoaded>
        <Flex
          boxShadow={'lg'}
          maxW={'640px'}
          direction={{ base: 'column-reverse', md: 'row' }}
          width={'full'}
          rounded={'xl'}
          p={10}
          justifyContent={'space-between'}
          position={'relative'}
          bg={useColorModeValue('gray.50', 'gray.800')}
          border={useColorModeValue('none', '1px solid #aaa')}
          _after={{
            content: '""',
            position: 'absolute',
            height: '21px',
            width: '29px',
            left: '35px',
            top: '-10px',
            backgroundSize: 'cover',
            backgroundImage: 'url(./../icons/twitter.png)'}}
          _before={{
            content: '""',
            position: 'absolute',
            zIndex: '-1',
            height: 'full',
            maxW: '640px',
            width: 'full',
            filter: 'blur(50px)',
            transform: 'scale(0.68)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            top: 0,
            left: 0,
            bg: 'white'
          }}>
          <Flex
            direction={'column'}
            textAlign={'left'}
            justifyContent={'space-between'}>
            <chakra.p
              fontFamily={'Inter'}
              fontWeight={'medium'}
              fontSize={'15px'}
              pb={4}>
              {content}
            </chakra.p>
            <chakra.p fontFamily={'Work Sans'} fontWeight={'bold'} fontSize={14}>
              {name}
              <chakra.span
                fontFamily={'Inter'}
                fontWeight={'medium'}
                color={'gray.500'}>
                {' '}
                - {role}
              </chakra.span>
            </chakra.p>
          </Flex>
          <Avatar
            src={avatar}
            height={'80px'}
            width={'80px'}
            alignSelf={'center'}
            m={{ base: '0 0 35px 0', md: '0 0 0 50px' }}
          />
        </Flex>
      </Skeleton>

    );
  }
  
  export default function GridBlurredBackdrop() {
    return (
      <Flex
        textAlign={'center'}
        pt={10}
        justifyContent={'center'}
        direction={'column'}
        width={'full'}>

        <SimpleGrid
          columns={{ base: 1, xl: 1 }}
          spacing={'20'}
          mt={16}
          mx={'auto'}>
          {testimonials.map((cardInfo, index) => (
            <TestmonialCard {...cardInfo} index={index} />
          ))}
        </SimpleGrid>
        <Box>
          <Icon viewBox="0 0 40 35" mt={14} boxSize={10} color={'purple.400'}>
            <path
              fill={'currentColor'}
              d="M10.7964 5.04553e-07C8.66112 -0.000123335 6.57374 0.632971 4.79827 1.81922C3.0228 3.00547 1.63898 4.69158 0.82182 6.66433C0.00466116 8.63708 -0.209132 10.8079 0.207477 12.9021C0.624087 14.9964 1.65239 16.9201 3.16233 18.4299L19.1153 34.3828C19.2395 34.5074 19.3871 34.6062 19.5496 34.6736C19.7121 34.741 19.8863 34.7757 20.0622 34.7757C20.2381 34.7757 20.4123 34.741 20.5748 34.6736C20.7373 34.6062 20.8848 34.5074 21.0091 34.3828L36.962 18.4272C38.9319 16.3917 40.0228 13.6636 39.9996 10.8311C39.9764 7.99858 38.8409 5.28867 36.838 3.28573C34.835 1.28279 32.1251 0.147283 29.2926 0.124081C26.4601 0.100879 23.732 1.19184 21.6965 3.1617L20.0622 4.79337L18.4305 3.1617C17.4276 2.15892 16.237 1.36356 14.9267 0.821064C13.6163 0.278568 12.2119 -0.000433066 10.7937 5.04553e-07H10.7964Z"
            />
          </Icon>
        </Box>
      </Flex>
    );
  }
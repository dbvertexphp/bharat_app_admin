/* eslint-disable */
'use client';

import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Divider,
  Card as ChakraCard,
  Image,
  Input,
  HStack,
	ModalFooter, // Added HStack to the import
} from '@chakra-ui/react';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom components
import Card from 'components/card/Card';

export default function OrdersTable() {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedWorker, setSelectedWorker] = React.useState(null);
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Fetch order from API
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!baseUrl || !token) {
          throw new Error('Missing base URL or authentication token');
        }
        if (!orderId) {
          throw new Error('Missing order ID');
        }
        const response = await axios.get(
          `${baseUrl}api/direct-order/getDirectOrderWithWorker/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log('API Response (Order):', response.data);
        if (!response.data?.data) {
          throw new Error('Invalid response format: Expected data object');
        }

        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Orders Error:', err);
        if (
          err.response?.data?.message === 'Not authorized, token failed' ||
          err.response?.data?.message ===
            'Session expired or logged in on another device' ||
          err.response?.data?.message ===
            'Un-Authorized, You are not authorized to access this route.' ||
          err.response?.data?.message === 'Not authorized, token failed'
        ) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError(err.message || 'Failed to fetch order');
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [navigate, orderId]);

  const getStatusStyles = (status, type) => {
    if (type === 'hireStatus') {
      switch (status.toLowerCase()) {
        case 'accepted':
          return { bg: 'green.100', color: 'green.800' };
        case 'pending':
          return { bg: 'yellow.100', color: 'yellow.800' };
        case 'rejected':
          return { bg: 'red.100', color: 'red.800' };
        default:
          return { bg: 'gray.100', color: 'gray.800' };
      }
    } else if (type === 'paymentStatus') {
      switch (status.toLowerCase()) {
        case 'success':
          return { bg: 'green.100', color: 'green.800' };
        case 'pending':
          return { bg: 'yellow.100', color: 'yellow.800' };
        case 'failed':
          return { bg: 'red.100', color: 'red.800' };
        default:
          return { bg: 'gray.100', color: 'gray.800' };
      }
    }
    return { bg: 'gray.100', color: 'gray.800' };
  };
  // Handle view worker details click
  const handleViewDetails = () => {
    setSelectedWorker(data.assignedWorker);
    onDetailsOpen();
  };

  if (loading) {
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        style={{ marginTop: '100px' }}
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
          Loading...
        </Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        style={{ marginTop: '100px' }}
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
          Error: {error}
        </Text>
      </Card>
    );
  }

  return (
    <>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        style={{ marginTop: '100px' }}
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="20px" justify="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Order Details
          </Text>
        </Flex>
        <Box p="20px">
          <ChakraCard
            p="20px"
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            bg={cardBg}
          >
            <VStack spacing={6} align="stretch">
              {/* User Section */}
              <ChakraCard
                p="15px"
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                bg={cardBg}
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap="4">
                    <Image
                      src="https://via.placeholder.com/60" // Replace with user image if available
                      alt="User"
                      boxSize="60px"
                      borderRadius="full"
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        {data.order?.user_id?.full_name || 'Not Assigned'}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Paid - ₹
                        {data.order?.service_payment?.amount || 0}/-
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </ChakraCard>

              {/* Service Provider Section */}
              <ChakraCard
                p="15px"
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                bg={cardBg}
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap="4">
                    <Image
                      src="https://via.placeholder.com/60" // Replace with service provider image if available
                      alt="Service Provider"
                      boxSize="60px"
                      borderRadius="full"
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        {data.order?.service_provider_id?.full_name ||
                          'Not Assigned'}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Recieve - ₹
                        {data.order?.service_payment?.amount || 0}/-
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </ChakraCard>

              {/* Worker Section */}
              {data.assignedWorker && (
                <ChakraCard
                  p="15px"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                  bg={cardBg}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap="4">
                      <Image
                        src={`${baseUrl}${data.assignedWorker.image}`}
                        alt="Worker"
                        boxSize="60px"
                        borderRadius="full"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/60"
                      />
                      <Box>
                        <Text fontWeight="bold" color={textColor}>
                          {data.assignedWorker.name || 'Not Assigned'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          AMOUNT - ₹
                          {data.order?.service_payment?.amount || 0}/-
                        </Text>
                      </Box>
                    </Flex>
                    <HStack spacing="2">
                      {' '}
                      {/* HStack is now defined */}
                      <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={handleViewDetails}
                      >
                        View Details
                      </Button>
                    </HStack>
                  </Flex>
                  <Text mt="2" color={textColor} fontWeight="bold">
                    Accepted by worker
                  </Text>
                </ChakraCard>
              )}

              {/* Order Details Section */}
              <ChakraCard
                p="15px"
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                bg={cardBg}
              >
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="bold" fontSize="lg" color={textColor}>
                    Order Details
                  </Text>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Project ID:
                    </Text>
                    <Text color={textColor}>
                      {data.order?.project_id || 'N/A'}
                    </Text>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Title:
                    </Text>
                    <Text color={textColor}>{data.order?.title || 'N/A'}</Text>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Description:
                    </Text>
                    <Text color={textColor}>
                      {data.order?.description || 'N/A'}
                    </Text>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Address:
                    </Text>
                    <Text color={textColor}>
                      {data.order?.address || 'N/A'}
                    </Text>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Deadline:
                    </Text>
                    <Text color={textColor}>
                      {data.order?.deadline
                        ? new Date(data.order.deadline).toLocaleDateString()
                        : 'N/A'}
                    </Text>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Image URL:
                    </Text>
                    <Image
                      src={`${baseUrl}${data.order?.image_url}`}
                      alt="Order Image"
                      boxSize="100px"
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/100"
                    />
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Platform Fee:
                    </Text>
                    <Text color={textColor}>
                      ₹{data.order?.platform_fee || 0}
                    </Text>
                  </Flex>
                </VStack>
              </ChakraCard>

              {/* Payment History Section */}
              <ChakraCard
                p="15px"
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                bg={cardBg}
              >
                <Text fontWeight="bold" fontSize="lg" color={textColor}>
                  Payment History
                </Text>
                {data.order?.service_payment?.payment_history?.length > 0 ? (
                  <VStack spacing={2} align="stretch" mt="2">
                    {data.order.service_payment.payment_history.map(
                      (payment, index) => (
                        <Flex
                          key={index}
                          align="center"
                          justify="space-between"
                        >
                          <Text>
                            {index + 1}. {payment.description}
                          </Text>
                          <Flex align="center" gap="2">
                            <Text
                              color={
                                payment.status === 'success'
                                  ? 'green.600'
                                  : 'gray.600'
                              }
                            >
                              {payment.status === 'success'
                                ? 'Paid'
                                : 'Pending'}
                            </Text>
                            <Text>₹{payment.amount}</Text>
                          </Flex>
                        </Flex>
                      ),
                    )}
                  </VStack>
                ) : (
                  <Text color={textColor} mt="2">
                    No payment history available
                  </Text>
                )}
              </ChakraCard>
            </VStack>
          </ChakraCard>
        </Box>
      </Card>

      {/* Worker Details Modal */}
      {selectedWorker && (
        <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="xl" boxShadow="2xl" p={4} bg={cardBg}>
            <ModalHeader
              fontSize="2xl"
              fontWeight="bold"
              color={textColor}
              textAlign="center"
            >
              Worker Details
            </ModalHeader>
            <ModalCloseButton
              size="lg"
              _hover={{ bg: 'gray.100', transform: 'scale(1.1)' }}
              transition="all 0.2s ease-in-out"
            />
            <ModalBody>
              <ChakraCard
                p="4"
                boxShadow="md"
                borderRadius="lg"
                bg={useColorModeValue('gray.50', 'gray.700')}
              >
                <VStack spacing={4} align="stretch">
                  <Flex align="center" gap="4">
                    <Image
                      src={`${baseUrl}${selectedWorker.image}`}
                      alt="Worker"
                      boxSize="100px"
                      borderRadius="full"
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/100"
                    />
                    <Box>
                      <Text fontWeight="bold" fontSize="xl" color={textColor}>
                        {selectedWorker.name}
                      </Text>
                      <Text color="gray.600">
                        Worker ID: {selectedWorker._id}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Phone:
                    </Text>
                    <Text color={textColor}>{selectedWorker.phone}</Text>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Address:
                    </Text>
                    <Text color={textColor}>{selectedWorker.address}</Text>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Date of Birth:
                    </Text>
                    <Text color={textColor}>
                      {new Date(selectedWorker.dob).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Flex align="start" gap="4">
                    <Text fontWeight="semibold" color={textColor}>
                      Verification Status:
                    </Text>
                    <Text
                      bg={
                        getStatusStyles(
                          selectedWorker.verifyStatus,
                          'verifyStatus',
                        ).bg
                      }
                      color={
                        getStatusStyles(
                          selectedWorker.verifyStatus,
                          'verifyStatus',
                        ).color
                      }
                      px="2"
                      py="1"
                      borderRadius="md"
                    >
                      {selectedWorker.verifyStatus}
                    </Text>
                  </Flex>
                </VStack>
              </ChakraCard>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                mr={3}
                onClick={onDetailsClose}
                _hover={{ bg: 'teal.600', transform: 'scale(1.05)' }}
                transition="all 0.2s ease-in-out"
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <ToastContainer />
    </>
  );
}

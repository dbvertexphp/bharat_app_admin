/* eslint-disable */
'use client';

import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Divider,
  Grid,
  GridItem,
  Card as ChakraCard,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom components
import Card from 'components/card/Card';

const columnHelper = createColumnHelper();

export default function OrdersTable() {
  const [sorting, setSorting] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const navigate = useNavigate();
  const { orderId } = useParams(); // Correctly destructure orderId

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

        const item = response.data.data;
        const formattedData = [{
          id: item.order?._id || '',
          orderId: item.order?.razorOrderIdPlatform || '',
          customerName: item.order?.user_id?.full_name || 'Unknown',
          serviceProvider: item.order?.service_provider_id?.full_name || 'N/A',
          assignedWorker: item.assignedWorker?.name || 'Not Assigned',
          totalAmount: item.order?.service_payment?.total_expected || 0,
          paidAmount: item.order?.service_payment?.amount || 0,
          remainingAmount: item.order?.service_payment?.remaining_amount || 0,
          paymentStatus: item.order?.payment_status || 'Unknown',
          hireStatus: item.order?.hire_status || 'Unknown',
          createdAt: item.order?.createdAt
            ? new Date(item.order.createdAt).toLocaleDateString()
            : '',
          address: item.order?.address || '',
          title: item.order?.title || '',
          description: item.order?.description || '',
          deadline: item.order?.deadline
            ? new Date(item.order.deadline).toLocaleDateString()
            : '',
          paymentHistory: item.order?.service_payment?.payment_history || [],
          assignedWorkerDetails: item.assignedWorker || null,
        }];

        setData(formattedData);
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

  // Handle view details click
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    onDetailsOpen();
  };

  // Status color mapping
  const getStatusStyles = (status, type) => {
    if (type === 'hireStatus') {
      switch (status) {
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
      switch (status) {
        case 'success':
          return { bg: 'green.100', color: 'green.800' };
        case 'pending':
          return { bg: 'yellow.100', color: 'yellow.800' };
        case 'failed':
          return { bg: 'red.100', color: 'red.800' };
        default:
          return { bg: 'gray.100', color: 'gray.800' };
      }
    } else if (type === 'verifyStatus') {
      switch (status) {
        case 'approved':
          return { bg: 'green.100', color: 'green.800' };
        case 'pending':
          return { bg: 'yellow.100', color: 'yellow.800' };
        case 'rejected':
          return { bg: 'red.100', color: 'red.800' };
        default:
          return { bg: 'gray.100', color: 'gray.800' };
      }
    }
    return { bg: 'gray.100', color: 'gray.800' };
  };

  const columns = [
    columnHelper.accessor('orderId', {
      id: 'orderId',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ORDER ID
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('customerName', {
      id: 'customerName',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          CUSTOMER
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('serviceProvider', {
      id: 'serviceProvider',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          SERVICE PROVIDER
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('assignedWorker', {
      id: 'assignedWorker',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ASSIGNED WORKER
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('totalAmount', {
      id: 'totalAmount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          TOTAL AMOUNT
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            ₹{info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('paidAmount', {
      id: 'paidAmount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          PAID AMOUNT
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            ₹{info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('remainingAmount', {
      id: 'remainingAmount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          REMAINING AMOUNT
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            ₹{info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('paymentStatus', {
      id: 'paymentStatus',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          PAYMENT STATUS
        </Text>
      ),
      cell: (info) => {
        const { bg, color } = getStatusStyles(info.getValue(), 'paymentStatus');
        return (
          <Flex align="center" bg={bg} px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color={color}>
              {info.getValue()}
            </Text>
          </Flex>
        );
      },
    }),
    columnHelper.accessor('hireStatus', {
      id: 'hireStatus',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          HIRE STATUS
        </Text>
      ),
      cell: (info) => {
        const { bg, color } = getStatusStyles(info.getValue(), 'hireStatus');
        return (
          <Flex align="center" bg={bg} px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color={color}>
              {info.getValue()}
            </Text>
          </Flex>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          CREATED AT
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ACTIONS
        </Text>
      ),
      cell: ({ row }) => (
        <Flex align="center" gap="2">
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => handleViewDetails(row.original)}
          >
            View Details
          </Button>
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  if (loading) {
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        style={{ marginTop: "100px" }}
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
        style={{ marginTop: "100px" }}
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
        style={{ marginTop: "100px" }}
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
        <Box>
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor={borderColor}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      {/* Details Modal */}
      {selectedOrder && (
        <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="xl" boxShadow="2xl" p={4} bg={useColorModeValue('white', 'gray.800')}>
            <ModalHeader fontSize="2xl" fontWeight="bold" color={textColor} textAlign="center">
              Order Details
            </ModalHeader>
            <ModalCloseButton
              size="lg"
              _hover={{ bg: 'gray.100', transform: 'scale(1.1)' }}
              transition="all 0.2s ease-in-out"
            />
            <ModalBody>
              <ChakraCard p={4} boxShadow="md" borderRadius="lg" bg={useColorModeValue('gray.50', 'gray.700')}>
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns={{ base: '1fr', md: '150px 1fr' }} gap={4}>
                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Order ID:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.orderId}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Customer:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.customerName}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Service Provider:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.serviceProvider}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Assigned Worker:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.assignedWorker}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Title:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.title}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Description:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.description}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Address:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.address}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Total Amount:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>₹{selectedOrder.totalAmount}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Paid Amount:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>₹{selectedOrder.paidAmount}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Remaining Amount:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>₹{selectedOrder.remainingAmount}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Payment Status:</Text>
                    </GridItem>
                    <GridItem>
                      <Flex align="center" bg={getStatusStyles(selectedOrder.paymentStatus, 'paymentStatus').bg} px={2} py={1} borderRadius="md">
                        <Text fontSize="sm" color={getStatusStyles(selectedOrder.paymentStatus, 'paymentStatus').color}>
                          {selectedOrder.paymentStatus}
                        </Text>
                      </Flex>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Hire Status:</Text>
                    </GridItem>
                    <GridItem>
                      <Flex align="center" bg={getStatusStyles(selectedOrder.hireStatus, 'hireStatus').bg} px={2} py={1} borderRadius="md">
                        <Text fontSize="sm" color={getStatusStyles(selectedOrder.hireStatus, 'hireStatus').color}>
                          {selectedOrder.hireStatus}
                        </Text>
                      </Flex>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Created At:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.createdAt}</Text>
                    </GridItem>

                    <GridItem>
                      <Text fontWeight="semibold" color={textColor}>Deadline:</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor}>{selectedOrder.deadline}</Text>
                    </GridItem>
                  </Grid>

                  <Divider />

                  <Text fontWeight="bold" fontSize="lg" color={textColor}>
                    Payment History
                  </Text>
                  {selectedOrder.paymentHistory.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      {selectedOrder.paymentHistory.map((payment, index) => (
                        <ChakraCard key={index} p={3} boxShadow="sm" borderRadius="md" bg={useColorModeValue('white', 'gray.600')}>
                          <Text color={textColor}>
                            <strong>Payment {index + 1}:</strong> ₹{payment.amount} - {payment.description} ({payment.status}) on{' '}
                            {new Date(payment.date).toLocaleDateString()}
                          </Text>
                        </ChakraCard>
                      ))}
                    </VStack>
                  ) : (
                    <Text color={textColor}>No payment history available</Text>
                  )}

                  <Divider />

                  <Text fontWeight="bold" fontSize="lg" color={textColor}>
                    Assigned Worker Details
                  </Text>
                  {selectedOrder.assignedWorkerDetails ? (
                    <ChakraCard p={3} boxShadow="sm" borderRadius="md" bg={useColorModeValue('white', 'gray.600')}>
                      <VStack spacing={2} align="stretch">
                        <Text color={textColor}>
                          <strong>Name:</strong> {selectedOrder.assignedWorkerDetails.name}
                        </Text>
                        <Text color={textColor}>
                          <strong>Phone:</strong> {selectedOrder.assignedWorkerDetails.phone}
                        </Text>
                        <Text color={textColor}>
                          <strong>Address:</strong> {selectedOrder.assignedWorkerDetails.address}
                        </Text>
                        <Text color={textColor}>
                          <strong>Date of Birth:</strong>{' '}
                          {new Date(selectedOrder.assignedWorkerDetails.dob).toLocaleDateString()}
                        </Text>
                        <Text color={textColor}>
                          <strong>Verification Status:</strong>{' '}
                          <Flex
                            as="span"
                            align="center"
                            bg={getStatusStyles(selectedOrder.assignedWorkerDetails.verifyStatus, 'verifyStatus').bg}
                            px={2}
                            py={1}
                            borderRadius="md"
                            display="inline-flex"
                          >
                            <Text
                              fontSize="sm"
                              color={getStatusStyles(selectedOrder.assignedWorkerDetails.verifyStatus, 'verifyStatus').color}
                            >
                              {selectedOrder.assignedWorkerDetails.verifyStatus}
                            </Text>
                          </Flex>
                        </Text>
                        {selectedOrder.assignedWorkerDetails.image && (
                          <Box>
                            <Text color={textColor} fontWeight="semibold">Worker Image:</Text>
                            <Box
                              as="img"
                              src={`${baseUrl}${selectedOrder.assignedWorkerDetails.image}`}
                              alt="Worker Image"
                              maxW="150px"
                              borderRadius="md"
                              mt={2}
                            />
                          </Box>
                        )}
                      </VStack>
                    </ChakraCard>
                  ) : (
                    <Text color={textColor}>No assigned worker details available</Text>
                  )}
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

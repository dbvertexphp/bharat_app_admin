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
import { useNavigate } from 'react-router-dom';
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

  // Fetch orders from API
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  React.useEffect(() => {
	const fetchOrders = async () => {
	  try {
		if (!baseUrl || !token) {
		  throw new Error('Missing base URL or authentication token');
		}
		const response = await axios.get(
		  `${baseUrl}api/direct-order/getAllDirectOrders`,
		  {
			headers: { Authorization: `Bearer ${token}` },
		  },
		);
		console.log('API Response (Orders):', response.data);
		if (!response.data || !Array.isArray(response.data.data)) {
		  throw new Error(
			'Invalid response format: Expected an array of orders',
		  );
		}

		const formattedData = response.data.data.map((item) => ({
		  id: item._id || '',
		  orderId: item.razorOrderIdPlatform || '',
		  customerName: item.user_id?.full_name || 'Unknown',
		  serviceProvider: item.service_provider_id?.full_name || 'N/A',
		  totalAmount: item.service_payment?.total_expected || 0,
		  paidAmount: item.service_payment?.amount || 0,
		  remainingAmount: item.remaining_amount?.amount || 0,
		  paymentStatus: item.payment_status || 'Unknown',
		  hireStatus: item.hire_status || 'Unknown',
		  createdAt: item.createdAt
			? new Date(item.createdAt).toLocaleDateString()
			: '',
		  address: item.address,
		  title: item.title,
		  description: item.description,
		  deadline: item.deadline
			? new Date(item.deadline).toLocaleDateString()
			: '',
		  paymentHistory: item.service_payment?.payment_history || [],
		}));

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
		  setError(err.message || 'Failed to fetch orders');
		  setLoading(false);
		}
	  }
	};

	fetchOrders();
  }, [navigate]);

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
		style={{marginTop:"100px"}}
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
		style={{marginTop:"100px"}}
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
		style={{marginTop:"100px"}}
		overflowX={{ sm: 'scroll', lg: 'hidden' }}
	  >
		<Flex px="25px" mb="20px" justify="space-between" align="center">
		  <Text
			color={textColor}
			fontSize="22px"
			fontWeight="700"
			lineHeight="100%"
		  >
			Orders Table
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
		<Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
		  <ModalOverlay />
		  <ModalContent>
			<ModalHeader>Order Details</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
			  <Text>
				<strong>Order ID:</strong> {selectedOrder.orderId}
			  </Text>
			  <Text>
				<strong>Customer:</strong> {selectedOrder.customerName}
			  </Text>
			  <Text>
				<strong>Service Provider:</strong> {selectedOrder.serviceProvider}
			  </Text>
			  <Text>
				<strong>Title:</strong> {selectedOrder.title}
			  </Text>
			  <Text>
				<strong>Description:</strong> {selectedOrder.description}
			  </Text>
			  <Text>
				<strong>Address:</strong> {selectedOrder.address}
			  </Text>
			  <Text>
				<strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
			  </Text>
			  <Text>
				<strong>Paid Amount:</strong> ₹{selectedOrder.paidAmount}
			  </Text>
			  <Text>
				<strong>Payment Status:</strong> {selectedOrder.paymentStatus}
			  </Text>
			  <Text>
				<strong>Hire Status:</strong> {selectedOrder.hireStatus}
			  </Text>
			  <Text>
				<strong>Created At:</strong> {selectedOrder.createdAt}
			  </Text>
			  <Text>
				<strong>Deadline:</strong> {selectedOrder.deadline}
			  </Text>
			  <Text>
				<strong>Payment History:</strong>
			  </Text>
			  {selectedOrder.paymentHistory.length > 0 ? (
				<Box mt={2}>
				  {selectedOrder.paymentHistory.map((payment, index) => (
					<Box key={index} mb={2}>
					  <Text>
						<strong>Payment {index + 1}:</strong> ₹{payment.amount} -{' '}
						{payment.description} ({payment.status}) on{' '}
						{new Date(payment.date).toLocaleDateString()}
					  </Text>
					</Box>
				  ))}
				</Box>
			  ) : (
				<Text>No payment history available</Text>
			  )}
			</ModalBody>
			<ModalFooter>
			  <Button colorScheme="blue" mr={3} onClick={onDetailsClose}>
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

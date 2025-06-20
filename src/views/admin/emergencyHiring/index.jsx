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
  Select,
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
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

// Custom components
import Card from 'components/card/Card';
import { RiH1 } from 'react-icons/ri';

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
		  `${baseUrl}api/admin/getAllOnlineOrdersByRestaurant`,
		  {
			headers: { Authorization: `Bearer ${token}` },
		  },
		);
		console.log('API Response (Orders):', response.data);

		if (!response.data || !Array.isArray(response.data)) {
		  throw new Error(
			'Invalid response format: Expected an array of orders',
		  );
		}

		const formattedData = response.data.map((item) => ({
		  id: item._id || '',
		  orderId: item.orderId || '',
		  customerName: item.user_id?.full_name || 'Unknown',
		  restaurant_id: item.restaurant_id.name || 'N/A',
		  totalAmount: item.totalAmount || 0,
		  paymentMethod: item.paymentMethod,
		  orderStatus: item.orderStatus || 'Unknown',
		  paymentStatus: item.paymentStatus || 'Unknown',
		  createdAt: item.createdAt
			? new Date(item.createdAt).toLocaleDateString()
			: '',
		  shippingAddress: item.shippingAddress,
		  items: item.items,
		  totalPrice: item.totalPrice,
		  taxAmount: item.taxAmount,
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
	if (type === 'orderStatus') {
	  switch (status) {
		case 'Preparing':
		  return { bg: 'yellow.100', color: 'yellow.800' };
		case 'Out for Delivery':
		  return { bg: 'orange.100', color: 'orange.800' };
		case 'Delivered':
		  return { bg: 'green.100', color: 'green.800' };
		case 'Cancelled':
		  return { bg: 'red.100', color: 'red.800' };
		default:
		  return { bg: 'gray.100', color: 'gray.800' };
	  }
	} else if (type === 'paymentStatus') {
	  switch (status) {
		case 'Paid':
		  return { bg: 'green.100', color: 'green.800' };
		case 'Failed':
		  return { bg: 'red.100', color: 'red.800' };
		default:
		  return { bg: 'gray.100', color: 'gray.800' };
	  }
	}
	return { bg: 'gray.100', color: 'gray.800' };
  };

  // Handle order status update with separate toast
  //   const handleOrderStatusChange = async (id, field, value) => {
  //     try {
  //       await axios.patch(
  //         `${baseUrl}api/admin/update-cod-order-status/${id}`,
  //         { [field]: value },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       setData((prev) =>
  //         prev.map((item) =>
  //           item.id === id ? { ...item, [field]: value } : item
  //         )
  //       );
  //       toast.success(`Order Status updated to ${value}!`, {
  //         position: 'top-right',
  //         autoClose: 3000,
  //       });
  //     } catch (err) {
  //       console.error('Order Status Update Error:', err);
  //       toast.error('Failed to update order status', {
  //         position: 'top-right',
  //         autoClose: 3000,
  //       });
  //     }
  //   };

  // Handle payment status update with separate toast
  //   const handlePaymentStatusChange = async (id, field, value) => {
  //     try {
  //       await axios.patch(
  //         `${baseUrl}api/admin/update-cod-payment-status/${id}`,
  //         { [field]: value },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       setData((prev) =>
  //         prev.map((item) =>
  //           item.id === id ? { ...item, [field]: value } : item
  //         )
  //       );
  //       toast.success(`Payment Status updated to ${value}!`, {
  //         position: 'top-right',
  //         autoClose: 3000,
  //       });
  //     } catch (err) {
  //       console.error('Payment Status Update Error:', err);
  //       toast.error('Failed to update payment status', {
  //         position: 'top-right',
  //         autoClose: 3000,
  //       });
  //     }
  //   };

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
	columnHelper.accessor('restaurant_id', {
	  id: 'restaurant_id',
	  header: () => (
		<Text
		  justifyContent="space-between"
		  align="center"
		  fontSize={{ sm: '10px', lg: '12px' }}
		  color="gray.400"
		>
		  RESTAURANT
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
	columnHelper.accessor('paymentMethod', {
	  id: 'paymentMethod',
	  header: () => (
		<Text
		  justifyContent="space-between"
		  align="center"
		  fontSize={{ sm: '10px', lg: '12px' }}
		  color="gray.400"
		>
		  PAYMENT METHOD
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
	columnHelper.accessor('orderStatus', {
	  id: 'orderStatus',
	  header: () => (
		<Text
		  justifyContent="space-between"
		  align="center"
		  fontSize={{ sm: '10px', lg: '12px' }}
		  color="gray.400"
		>
		  ORDER STATUS
		</Text>
	  ),
	  cell: (info) => {
		const { bg, color } = getStatusStyles(info.getValue(), 'orderStatus');
		return (
		  <Flex align="center" bg={bg} px={2} py={1} borderRadius="md">
			<Text fontSize="sm" color={color}>
			  {info.getValue()}
			</Text>
		  </Flex>
		);
	  },
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
		overflowX={{ sm: 'scroll', lg: 'hidden' }}
	  >
		<Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
		  Error: {error}
		</Text>
	  </Card>
	);
  }

  return (
	<h1> </h1>
  );
}

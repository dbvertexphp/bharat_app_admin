import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdPerson,
  MdHome,
  MdLock,
  MdInfo,
	MdPrivacyTip,
	MdEmergency,
	MdPersonAddAlt1,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/dashboard';
// import NFTMarketplace from 'views/admin/marketplace';
// import Profile from 'views/admin/profile';
// import DataTables from 'views/admin/dataTables';
import Users from 'views/admin/User';
import ServiceProvider from 'views/admin/ServiceProvider';
import AddAboutus from 'views/admin/addAboutUs';
import AddTermsConditions from 'views/admin/addTermsCondition';
import AddPrivacyPolicy from 'views/admin/addPrivacyPolicy';
import Biding from 'views/admin/Biding';
import DirectHiring from 'views/admin/directHiring';
import Emergency from 'views/admin/emergencyHiring';
// import SubAdmin from 'views/admin/SubAdmin';
// import Restaurant from 'views/admin/Restaurant';
// import OnlineOrders from 'views/admin/onlineOrders';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import { FaFileContract, FaGavel,} from 'react-icons/fa';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Users',
    layout: '/admin',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    path: '/users',
    component: <Users />,
  },
  {
    name: 'Service Provider',
    layout: '/admin',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    path: '/service_provider',
    component: <ServiceProvider />,
  },
	 {
    name: 'Biding Hiring',
    layout: '/admin',
    icon: <Icon as={FaGavel} width="20px" height="20px" color="inherit" />,
    path: '/biding',
    component: <Biding />,
  },
	 {
    name: 'Direct Hiring',
    layout: '/admin',
    icon: <Icon as={MdPersonAddAlt1} width="20px" height="20px" color="inherit" />,
    path: '/direct-hiring',
    component: <DirectHiring />,
  },
	 {
    name: 'Emergency Hiring',
    layout: '/admin',
    icon: <Icon as={MdEmergency} width="20px" height="20px" color="inherit" />,
    path: '/emergency-hiring',
    component: <Emergency />,
  },
  {
    name: 'About Us',
    layout: '/admin',
    icon: <Icon as={MdInfo} width="20px" height="20px" color="inherit" />,
    path: '/add-aboutus',
    component: <AddAboutus />,
  },
	 {
    name: 'Terms&Conditions',
    layout: '/admin',
    icon: <Icon as={FaFileContract} width="20px" height="20px" color="inherit" />,
    path: '/add-terms-conditions',
    component: <AddTermsConditions />,
  },
	 {
    name: 'Privacy Policy',
    layout: '/admin',
    icon: <Icon as={MdPrivacyTip} width="20px" height="20px" color="inherit" />,
    path: '/add-privacypolicy',
    component: <AddPrivacyPolicy />,
  },
  // {
  //   name: 'SubAdmins',
  //   layout: '/admin',
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   path: '/subadmins',
  //   component: <SubAdmin />,
  // },
  // {
  //   name: 'Create SubAdmin',
  //   layout: '/admin',
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   path: '/create-subadmin',
  //   component: <CreateSubadmin />,
  // },
  // {
  //   name: 'Restaurants',
  //   layout: '/admin',
  //   icon: (
  //     <Icon as={MdRestaurantMenu} width="20px" height="20px" color="inherit" />
  //   ),
  //   path: '/restaurants',
  //   component: <Restaurant />,
  // },
  // {
  //   name: 'Add Restaurant',
  //   layout: '/admin',
  //   icon: <Icon as={FaUtensils} width="20px" height="20px" color="inherit" />,
  //   path: '/create-restaurant',
  //   component: <CreateRestaurant />,
  // },
  //  {
  //   name: 'Cod Orders',
  //   layout: '/admin',
  //   icon: <Icon as={FaUtensils} width="20px" height="20px" color="inherit" />,
  //   path: '/cod-orders',
  //   component: <CodOrders />,
  // },
  //  {
  //   name: 'Online Orders',
  //   layout: '/admin',
  //   icon: <Icon as={FaUtensils} width="20px" height="20px" color="inherit" />,
  //   path: '/online-orders',
  //   component: <OnlineOrders />,
  // },
  // {
  //   name: 'NFT Marketplace',
  //   layout: '/admin',
  //   path: '/nft-marketplace',
  //   icon: (
  //     <Icon
  //       as={MdOutlineShoppingCart}
  //       width="20px"
  //       height="20px"
  //       color="inherit"
  //     />
  //   ),
  //   component: <NFTMarketplace />,
  //   secondary: true,
  // },
  // {
  //   name: 'Data Tables',
  //   layout: '/admin',
  //   icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
  //   path: '/data-tables',
  //   component: <DataTables />,
  // },
  {
    name: 'Sign In',
    layout: '/', // Updated for navigation purposes
    path: '/', // Updated for navigation purposes
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;

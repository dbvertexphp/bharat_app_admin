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
	MdCategory,
	MdAttachMoney,
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
import WorkCategory from 'views/admin/workCategory';
import PlatformFee from 'views/admin/platformfee';
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
    name: 'Work Category',
    layout: '/admin',
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    path: '/work_category',
    component: <WorkCategory />,
  },
		{
    name: 'Platform Fees',
    layout: '/admin',
    icon: <Icon as={MdAttachMoney} width="20px" height="20px" color="inherit" />,
    path: '/platform_fee',
    component: <PlatformFee />,
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
  {
    name: 'Sign In',
    layout: '/', // Updated for navigation purposes
    path: '/', // Updated for navigation purposes
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;

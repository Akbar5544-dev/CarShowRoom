import React, {useEffect, useMemo, useRef} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../screens/showroom/Home';
import {Login} from '../screens/Login';
import {SignUp} from '../screens/SignUp';
import {CustomerHome} from '../screens/customer/CustomerHome';
import {CustomerVehicles} from '../screens/customer/CustomerVehicles';
import {CustomerShowrooms} from '../screens/customer/CustomerShowrooms';
import {CustomerChat} from '../screens/customer/CustomerChat';
import {CustomerJobs} from '../screens/customer/CustomerJobs';
import {CustomerJobDetail} from '../screens/customer/CustomerJobs/JobDetail';
import {Rentals} from '../screens/showroom/Rentals';
import {AllVehicles} from '../screens/showroom/AllVehicles';
import {ReturnVehicle} from '../screens/showroom/ReturnVehicle';
import {NewRental} from '../screens/showroom/NewRental';
import {RentalInvoice} from '../screens/showroom/RentalInvoice';
import {RentalOrders} from '../screens/showroom/RentalOrders';
import {Settings} from '../screens/showroom/Settings';
import {MyProfile} from '../screens/showroom/MyProfile';
import {CompanyProfile} from '../screens/showroom/CompanyProfile';
import {Languages} from '../screens/showroom/Languages';
import {Notifications} from '../screens/showroom/Notifications';
import {Security} from '../screens/showroom/Security';
import {Theme} from '../screens/showroom/Theme';
import {BackupRestore} from '../screens/showroom/BackupRestore';
import {RolesPermissions} from '../screens/showroom/RolesPermissions';
import {ManageRoles} from '../screens/showroom/ManageRoles';
import {CreateRole} from '../screens/showroom/CreateRole';
import {ActivityLog} from '../screens/showroom/ActivityLog';
import {RoleOverview} from '../screens/showroom/RoleOverview';
import {EditRole} from '../screens/showroom/EditRole';
import {JobsHiring} from '../screens/showroom/JobsHiring';
import {OpenPositions} from '../screens/showroom/OpenPositions';
import {PostJob} from '../screens/showroom/PostJob';
import {InterviewSchedule} from '../screens/showroom/InterviewSchedule';
import {LiveInterview} from '../screens/showroom/LiveInterview';
import {ScheduleInterview} from '../screens/showroom/ScheduleInterview';
import {RescheduleInterview} from '../screens/showroom/RescheduleInterview';
import {Applications} from '../screens/showroom/Applications';
import {ReviewApplication} from '../screens/showroom/ReviewApplication';
import {JobsOnboarding} from '../screens/showroom/JobsOnboarding';
import {HiringPipeline} from '../screens/showroom/HiringPipeline';
import {Accounting} from '../screens/showroom/Accounting';
import {Invoices} from '../screens/showroom/Invoices';
import {Staff} from '../screens/showroom/Staff';
import {AllEmployees} from '../screens/showroom/AllEmployees';
import {StaffOverview} from '../screens/showroom/StaffOverview';
import {AddEmployee} from '../screens/showroom/AddEmployee';
import {Vehicles} from '../screens/showroom/Vehicles';
import {VehicleList} from '../screens/showroom/Vehicles/VehicleList';
import {AddVehicle} from '../screens/showroom/AddVehicle';
import {RentalVehicle} from '../screens/showroom/RentalVehicle';
import {VehicleDetail} from '../screens/showroom/VehicleDetail';
import {EditVehicle} from '../screens/showroom/EditVehicle';
import {useAuthBootstrap} from '../hooks';
import {useAppSelector} from '../store/hooks';
import {useThemeColors} from '../theme';
import {isCustomerRole} from '../utils/authRole';
import type {
  CustomerJobsStackParamList,
  CustomerTabParamList,
  HomeStackParamList,
  RentalsStackParamList,
  RootStackParamList,
  RootTabParamList,
  StaffStackParamList,
  VehiclesStackParamList,
} from './types';
import {ShowroomTabBar} from './ShowroomTabBar';
import {CustomerTabBar} from './CustomerTabBar';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const StaffStack = createNativeStackNavigator<StaffStackParamList>();
const RentalsStack = createNativeStackNavigator<RentalsStackParamList>();
const VehiclesStack = createNativeStackNavigator<VehiclesStackParamList>();
const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const CustomerJobsStack =
  createNativeStackNavigator<CustomerJobsStackParamList>();

function CustomerJobsNavigator() {
  return (
    <CustomerJobsStack.Navigator screenOptions={{headerShown: false}}>
      <CustomerJobsStack.Screen
        name="CustomerJobsList"
        component={CustomerJobs}
      />
      <CustomerJobsStack.Screen
        name="CustomerJobDetail"
        component={CustomerJobDetail}
      />
    </CustomerJobsStack.Navigator>
  );
}

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeMain" component={Home} />
      <HomeStack.Screen name="Settings" component={Settings} />
      <HomeStack.Screen name="MyProfile" component={MyProfile} />
      <HomeStack.Screen name="CompanyProfile" component={CompanyProfile} />
      <HomeStack.Screen name="Languages" component={Languages} />
      <HomeStack.Screen name="Notifications" component={Notifications} />
      <HomeStack.Screen name="Security" component={Security} />
      <HomeStack.Screen name="Theme" component={Theme} />
      <HomeStack.Screen name="BackupRestore" component={BackupRestore} />
      <HomeStack.Screen name="RolesPermissions" component={RolesPermissions} />
      <HomeStack.Screen name="ManageRoles" component={ManageRoles} />
      <HomeStack.Screen name="CreateRole" component={CreateRole} />
      <HomeStack.Screen name="ActivityLog" component={ActivityLog} />
      <HomeStack.Screen name="RoleOverview" component={RoleOverview} />
      <HomeStack.Screen name="EditRole" component={EditRole} />
      <HomeStack.Screen name="JobsHiring" component={JobsHiring} />
      <HomeStack.Screen name="OpenPositions" component={OpenPositions} />
      <HomeStack.Screen name="PostJob" component={PostJob} />
      <HomeStack.Screen
        name="InterviewSchedule"
        component={InterviewSchedule}
      />
      <HomeStack.Screen name="LiveInterview" component={LiveInterview} />
      <HomeStack.Screen
        name="ScheduleInterview"
        component={ScheduleInterview}
      />
      <HomeStack.Screen
        name="RescheduleInterview"
        component={RescheduleInterview}
      />
      <HomeStack.Screen name="Applications" component={Applications} />
      <HomeStack.Screen
        name="ReviewApplication"
        component={ReviewApplication}
      />
      <HomeStack.Screen name="JobsOnboarding" component={JobsOnboarding} />
      <HomeStack.Screen name="HiringPipeline" component={HiringPipeline} />
      <HomeStack.Screen name="Accounting" component={Accounting} />
      <HomeStack.Screen name="Invoices" component={Invoices} />
    </HomeStack.Navigator>
  );
}

function StaffNavigator() {
  return (
    <StaffStack.Navigator screenOptions={{headerShown: false}}>
      <StaffStack.Screen name="StaffList" component={Staff} />
      <StaffStack.Screen name="AllEmployees" component={AllEmployees} />
      <StaffStack.Screen name="StaffOverview" component={StaffOverview} />
      <StaffStack.Screen name="AddEmployee" component={AddEmployee} />
    </StaffStack.Navigator>
  );
}

function RentalsNavigator() {
  return (
    <RentalsStack.Navigator screenOptions={{headerShown: false}}>
      <RentalsStack.Screen name="RentalsList" component={Rentals} />
      <RentalsStack.Screen name="AllVehicles" component={AllVehicles} />
      <RentalsStack.Screen name="ReturnVehicle" component={ReturnVehicle} />
      <RentalsStack.Screen name="NewRental" component={NewRental} />
      <RentalsStack.Screen name="RentalInvoice" component={RentalInvoice} />
      <RentalsStack.Screen name="RentalOrders" component={RentalOrders} />
    </RentalsStack.Navigator>
  );
}

function VehiclesNavigator() {
  return (
    <VehiclesStack.Navigator screenOptions={{headerShown: false}}>
      <VehiclesStack.Screen name="VehiclesMain" component={Vehicles} />
      <VehiclesStack.Screen name="VehicleList" component={VehicleList} />
      <VehiclesStack.Screen name="AddVehicle" component={AddVehicle} />
      <VehiclesStack.Screen name="RentalVehicle" component={RentalVehicle} />
      <VehiclesStack.Screen name="VehicleDetail" component={VehicleDetail} />
      <VehiclesStack.Screen name="EditVehicle" component={EditVehicle} />
    </VehiclesStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <ShowroomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Rentals" component={RentalsNavigator} />
      <Tab.Screen name="Staff" component={StaffNavigator} />
      <Tab.Screen name="Vehicles" component={VehiclesNavigator} />
    </Tab.Navigator>
  );
}

function CustomerTabs() {
  return (
    <CustomerTab.Navigator
      tabBar={props => <CustomerTabBar {...props} />}
      screenOptions={{headerShown: false, tabBarHideOnKeyboard: true}}>
      <CustomerTab.Screen name="CustomerHomeTab" component={CustomerHome} />
      <CustomerTab.Screen
        name="CustomerVehiclesTab"
        component={CustomerVehicles}
      />
      <CustomerTab.Screen
        name="CustomerShowroomsTab"
        component={CustomerShowrooms}
      />
      <CustomerTab.Screen name="CustomerChatTab" component={CustomerChat} />
      <CustomerTab.Screen
        name="CustomerJobsTab"
        component={CustomerJobsNavigator}
      />
    </CustomerTab.Navigator>
  );
}

export function RootNavigator() {
  useAuthBootstrap();
  const colors = useThemeColors();
  const bootstrapping = useAppSelector(state => state.app.bootstrapping);
  const isAuthenticated = useAppSelector(state => state.app.isAuthenticated);
  const user = useAppSelector(state => state.app.user);
  const navigationRef = useRef<any>(null);

  const authenticatedRoute = useMemo(
    () => (isCustomerRole(user) ? 'CustomerHome' : 'Main'),
    [user],
  );

  useEffect(() => {
    if (bootstrapping || !navigationRef.current) {
      return;
    }
    navigationRef.current.reset({
      index: 0,
      routes: [{name: isAuthenticated ? authenticatedRoute : 'Login'}],
    });
  }, [authenticatedRoute, bootstrapping, isAuthenticated]);

  if (bootstrapping) {
    return (
      <View style={[styles.boot, {backgroundColor: colors.background}]}>
        <NavigationContainer ref={navigationRef}>
          <RootStack.Navigator
            initialRouteName={isAuthenticated ? authenticatedRoute : 'Login'}
            screenOptions={{headerShown: false, animation: 'fade'}}>
            <RootStack.Screen name="Login" component={Login} />
            <RootStack.Screen name="SignUp" component={SignUp} />
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen name="CustomerHome" component={CustomerTabs} />
          </RootStack.Navigator>
        </NavigationContainer>
        <View style={styles.bootOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.actionBlue} />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName={isAuthenticated ? authenticatedRoute : 'Login'}
        screenOptions={{headerShown: false, animation: 'fade'}}>
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="SignUp" component={SignUp} />
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen name="CustomerHome" component={CustomerTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
  },
  bootOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

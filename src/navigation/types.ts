import type {NavigatorScreenParams} from '@react-navigation/native';
import type {ProfileTabId} from '../components/ProfileTabs';

export type HomeStackParamList = {
  HomeMain: undefined;
  Settings: undefined;
  MyProfile: undefined;
  CompanyProfile: undefined;
  Languages: undefined;
  Notifications: undefined;
  Security: undefined;
  Theme: undefined;
  BackupRestore: undefined;
  RolesPermissions: undefined;
  ManageRoles: undefined;
  CreateRole: undefined;
  ActivityLog: undefined;
  RoleOverview: {roleId: string};
  EditRole: {roleId: string};
  JobsHiring: undefined;
  OpenPositions: undefined;
  PostJob: undefined;
  InterviewSchedule: undefined;
  LiveInterview: undefined;
  ScheduleInterview: undefined;
  RescheduleInterview: {interviewId?: string} | undefined;
  Applications: {jobId?: string} | undefined;
  ReviewApplication: {applicationId: string};
  JobsOnboarding: undefined;
  HiringPipeline: undefined;
  Accounting: undefined;
  Invoices: undefined;
};

export type VehiclesStackParamList = {
  VehiclesMain: undefined;
  VehicleList: undefined;
  AddVehicle: undefined;
  RentalVehicle: {
    vehicleId: string;
    make: string;
    model: string;
    year: string;
    plateNo: string;
    fuelType: string;
    transmission: string;
    seats: string;
    mileageLabel: string;
    dailyRate: string;
    imageUri: string | null;
    imageTint: string;
    horsepower?: string;
    color?: string;
  };
  VehicleDetail: {
    vehicleId: string;
    make: string;
    model: string;
    year: string;
    plateNo: string;
    fuelType: string;
    transmission: string;
    seats: string;
    mileageLabel: string;
    dailyRate: string;
    imageUri: string | null;
    imageTint: string;
    status?: string;
    statusBg?: string;
    statusColor?: string;
  };
  EditVehicle: {
    vehicleId: string;
    make: string;
    model: string;
    year: string;
    plateNo: string;
    fuelType: string;
    transmission: string;
    seats: string;
    mileageLabel: string;
    dailyRate: string;
    imageUri: string | null;
    imageTint: string;
    status?: string;
  };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Rentals: NavigatorScreenParams<RentalsStackParamList> | undefined;
  Staff: NavigatorScreenParams<StaffStackParamList> | undefined;
  Vehicles: NavigatorScreenParams<VehiclesStackParamList> | undefined;
};

export type StaffStackParamList = {
  StaffList: undefined;
  AllEmployees: undefined;
  StaffOverview: {employeeId: string; initialTab?: ProfileTabId};
  AddEmployee: undefined;
};

export type RentalsStackParamList = {
  RentalsList: undefined;
  AllVehicles: undefined;
  ReturnVehicle: {rentalId?: string} | undefined;
  NewRental: undefined;
  RentalInvoice: {rentalId: string};
  RentalOrders: undefined;
};

export type CustomerJobsStackParamList = {
  CustomerJobsList: undefined;
  CustomerApplyJob: {jobId: string};
  CustomerJobDetail: {idOrSlug: string; title?: string};
};

export type CustomerShowroomsStackParamList = {
  CustomerShowroomsList: undefined;
  CustomerShowroomDetail: {showroomId: string};
  CustomerProductDetail: {productId: string; showroomId: string};
};

export type CustomerAuctionStackParamList = {
  CustomerAuctionList: undefined;
  CustomerPlaceBid: {auctionId: string};
};

export type CustomerHomeStackParamList = {
  CustomerHomeMain: undefined;
  CustomerEditProfile: undefined;
  CustomerSettings: undefined;
  CustomerSaved: undefined;
  CustomerLiked: undefined;
  CustomerShared: undefined;
  CustomerMessages: undefined;
  CustomerConversation: {
    conversationId: string;
    name: string;
    initials: string;
    tone: 'sc' | 'aw' | 'am' | 'mech' | 'cc';
    online: boolean;
    verified: boolean;
  };
  CustomerNotifications: undefined;
};

export type CustomerTabParamList = {
  CustomerHomeTab:
    | NavigatorScreenParams<CustomerHomeStackParamList>
    | undefined;
  CustomerShowroomsTab:
    | NavigatorScreenParams<CustomerShowroomsStackParamList>
    | undefined;
  CustomerMechanicsTab: undefined;
  CustomerAuctionTab:
    | NavigatorScreenParams<CustomerAuctionStackParamList>
    | undefined;
  CustomerJobsTab:
    | NavigatorScreenParams<CustomerJobsStackParamList>
    | undefined;
};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  CustomerHome: NavigatorScreenParams<CustomerTabParamList> | undefined;
};

import Login from "../Auth/Login";
import OtpGeneration from "../Auth/OtpGeneration";
import ResetPassword from "../Auth/ResetPassword";

import Profile from "../Profile/Profile";

import Approvals from "../CFS/Approvals/Approvals";
import HireTrailer from "../CFS/HireTrailer/HireTrailer";
import Training from "../CFS/Training/Training";
import Trips from "../CFS/Trips/Trips";
import Communication from "../CFS/Communication/Communication";
import Fuel from "../CFS/Fuel/Fuel";
import ManualUpdate from "../CFS/ManualUpdate/ManualUpdate";

import Driver from "../Reports/MasterReports/Driver";
import Trailer from "../Reports/MasterReports/Trailer";
import TripType from "../Reports/MasterReports/TripType";
import TrainingCalender from "../Reports/MasterReports/TrainingCalender";
import MaintenanceSchedule from "../Reports/MasterReports/MaintenanceSchedule";
import Pendency from "../Reports/DailyReports/Pendency";
import Trip from "../Reports/DailyReports/Trip";
import TAT from "../Reports/DailyReports/TAT";
import DieselUtilization from "../Reports/OperationalReports/DieselUtilization";
import DriverAttendance from "../Reports/OperationalReports/DriverAttendance";
import TrailerPerformance from "../Reports/OperationalReports/TrailerPerformance";
import AdhocMaintenance from "../Reports/OperationalReports/AdhocMaintenance";
import DriverTraining from "../Reports/OperationalReports/DriverTraining";
import HireTrailerReports from "../Reports/OperationalReports/HireTrailerReports";
import LGR from "../Reports/OperationalReports/LGR";
import DriverRoaster from "../Reports/OperationalReports/DriverRoaster";

import ConnectMobile from "../Admin/ConnectMobile/ConnectMobile";
import AdminDriverRoaster from '../Admin/DriverRoaster/DriverRoaster'
import ManageTrips from "../Admin/ManageTrips/ManageTrips";
import TripIntelligence from "../Admin/TripIntelligence/TripIntelligence";
import ManageUsers from "../Admin/ManageUsers/ManageUsers";
import UploadMasterData from "../Admin/UploadMasterData/UploadMasterData";
import CEODashBoard from "../CEO/CEODashBoard";
import DashBoardPage from "../CFS/Dashboard/DashBoardPage";
import NotFound from "./NotFound";
import VendorRegistrations from "../Admin/VendorRegistrations/VendorRegistrations";
import VendorServices from "../Admin/vendorServices/vendorService";
import VendorServicePlans from "../Admin/VendorServicePlans/VendorServicePlans";
import VendorMaster from "../Admin/Master/Master";

const DefaultRoutes = [
    {path: '/', exact: true, name: 'Login', component: Login},
    {path: '/login', exact: true, name: 'Login', component: Login},
    {path: '/otp', exact: true, name: 'OTP Generation', component: OtpGeneration},
    {path: '/reset-password', exact: true, name: 'Reset Password', component: ResetPassword}
];

const PrivateRoutes = {

    CFSManager: new Map([
        ['profile', Profile],
        ['dashboard', DashBoardPage],
        ['approvals', Approvals],
        ['hire-trailer', HireTrailer],
        ['training', Training],
        ['trips', Trips],
        ['fuel', Fuel],
        ['communication', Communication],
        ['manual-update', ManualUpdate]
    ]),

    Admin: new Map([
        ['manage-users', ManageUsers],
        ['manage-trips', ManageTrips],
        ['trip-intelligence', TripIntelligence],
        ['connect-mobile', ConnectMobile],
        ['upload-master-data', UploadMasterData],
        ['driver-roaster', AdminDriverRoaster],
        ['vendor-registration', VendorRegistrations],
        ['vendor-registration/services', VendorServices],
        ['vendor-registration/service-plans', VendorServicePlans],
        ['vendor-registration/master', VendorMaster]
    ]),  

    Reports: new Map([        
        ['report/master-reports/driver', Driver],
        ['report/master-reports/trip-Type', TripType],
        ['report/master-reports/trailer', Trailer],
        ['report/master-reports/training-Calender', TrainingCalender],
        ['report/master-reports/maintanence-Schedule', MaintenanceSchedule],
        ['report/daily-reports/pendency', Pendency],
        ['report/daily-reports/trip', Trip],
        ['report/daily-reports/TAT', TAT],
        ['report/operational-reports/diesel-Utilization', DieselUtilization],
        ['report/operational-reports/driver-Attendance', DriverAttendance],
        ['report/operational-reports/trailer-Performance', TrailerPerformance],
        ['report/operational-reports/adhoc-Maintenance', AdhocMaintenance],
        ['report/operational-reports/driver-Training', DriverTraining],
        ['report/operational-reports/hire-Trailer', HireTrailerReports],
        ['report/operational-reports/LGR', LGR],
        ['report/operational-reports/driver-Roaster', DriverRoaster]
    ]),

    CEO: new Map([
        ['ceo-dashboard', CEODashBoard]
    ]),

    NotFoundPage: NotFound
};
const Routes = {
    DefaultRoutes,
    PrivateRoutes
};

export default Routes;

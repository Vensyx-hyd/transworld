import {layoutReducer} from '../Pages/Layout/+state/Layout.reducer';
import {authReducer} from "../Pages/Auth/+state/Auth.reducer";
import {ceoDashboardReducer} from "../Pages/CEO/+state/ceodashboard.reducer";
import {dashboardReducer} from "../Pages/CFS/Dashboard/+state/dashboard.reducer";
import {AdminManageTripsReducer} from "../Pages/Admin/ManageTrips/+state/admin.trips.reducer";
import {AdminTripIntelligenceReducer} from "../Pages/Admin/TripIntelligence/+state/admin.tripintelligence.reducer";
import {AdminUsersReducer} from "../Pages/Admin/ManageUsers/+state/admin.users.reducer";
import {AdminMobileReducer} from "../Pages/Admin/ConnectMobile/+state/admin.mobile.reducer";
import { AdminVendorServiceReducer } from '../Pages/Admin/vendorServices/+state/admin.vendorservice.reducer';
import { AdminVendorServicePlanReducer } from '../Pages/Admin/VendorServicePlans/+state/admin.vendorserviceplan.reducer';
import { AdminVendorMasterReducer } from '../Pages/Admin/Master/+state/admin.vendormaster.reducer';

const reducers = {
    layout: layoutReducer,
    auth: authReducer,
    CEODashboard: ceoDashboardReducer,
    dashboard: dashboardReducer,
    adminManageTrips: AdminManageTripsReducer,
    adminTripIntelligence: AdminTripIntelligenceReducer,
    adminUsers: AdminUsersReducer,
    adminMobile: AdminMobileReducer,
    adminVendor: AdminVendorServiceReducer,
    adminVendor: AdminVendorServicePlanReducer,
    adminVendor: AdminVendorMasterReducer,
};

export default reducers;
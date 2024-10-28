export default {
    hostname: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : '/api',

    publicEndPoints: new Map([
        ["create", {path: "/authenticate/create", methods: ['post']}],
        ["auth", {path: "/authenticate", methods: ['post']}],
        ["otp", {path: "/authenticate/otp/", methods: ['get']}],
        ["reOtp", {path: "/authenticate/retryotp/", methods: ['get']}],
        ["verifyOtp", {path: "/authenticate/verifyotp/", methods: ['get']}],
        ["reset", {path: "/authenticate/reset", methods: ['put']}]        
    ]),

    privateEndPoints: new Map([       
        // Dashboard (CEO & CFS Manager)
        ["homeTrailers", {path: "/home/trailers", methods: ['get']}],
        ["homeDrivers", {path: "/home/drivers", methods: ['get']}],
        ["homeMessages", {path: "/home/msg", methods: ['get']}],
        ["deleteMessage", {path: "/home/msg/delete", methods: ['delete']}],

        // Dashboard (CEO)
        ["homePerformanceTrailers", {path: "/home/performance/trailers", methods: ['get']}],
        ["homePerformanceDrivers", {path: "/home/performance/drivers", methods: ['get']}],
        ["homePerformanceTrips", {path: "/home/performance/trips", methods: ['get']}],

        // --------------- CFS Manager ------------- //

        // Dashboard
        ["homeTrips", {path: "/home/trips", methods: ['get']}],
        ["runningInfo", {path: "/home/running/location", methods: ['get']}],
        ["idleInfo", {path: "/home/idle/location", methods: ['get']}],
        ["places", {path: "/home/place", methods: ['get']}],

        // Profile
        ["profile", {path: "/home/profile", methods: ['get']}],
        ["profileUpdate", {path: "/home/profile/", methods: ['put']}],

        // Approvals
        ["leaveApply", {path: "/leaves/apply", methods: ['post']}],
        ["cfsLeaves", {path: "/leaves/approve/all", methods: ['get']}],
        ["leaveDetails", {path: "/leaves/", methods: ['get']}],
        ["leaveApprove", {path: "/leaves/approve/", methods: ['post']}],
        ["approveFuelReq", {path: "/fuel/approve", methods: ['post']}],
        ["fuelReq", {path: "/fuel/approve", methods: ['get']}],
        ["maintenanceApprove", {path: "/drivers/notify/approve", methods: ['post']}],
        ["maintenanceReq", {path: "/drivers/notify/approval", methods: ['get']}],

        // Hire Trailer
        ["vendors", {path: "/admin/vendors", methods: ['get']}],
        ["trailers", {path: "/trailers", methods: ['get','put']}],
        ["trailerCreate", {path: "/trailers/create", methods: ['post']}],

        // Training
        ["trainingCreate", {path: "/trainings/create", methods: ['post']}],
        ["trainingList", {path: "/trainings", methods: ['get']}],
        ["trainingAssign", {path: "/trainings/assign", methods: ['post']}],

        // Trips
        ["trips", {path: "/trips/list/all", methods: ['get']}],
        ["scheduledTrips", {path: "/trips/scheduled/all", methods: ['get']}],
        ["tripDetails", {path: "/trips/", methods: ['get']}],
        ["driversList", {path: "/drivers/list", methods: ['get']}],
        ["driversEmpId", {path: "/drivers/empid/list", methods:['get']}],        
        ["endLocList", {path: "/trips/locations/list", methods: ['get']}],
        ["tripUpdate", {path: "/trips/loc", methods: ['put']}],
        ["scheduleCreateTrip", {path: "/trips/create", methods: ['post']}],
        ["trailerBySysid", {path: "/trailers/sysid", methods: ['post']}],
        ["managerTrips", {path: "/trips/manager/all", methods: ['get']}],

        // Fuel
        ["fuel", {path: "/fuel/list", methods: ['get']}],
        ["fuelCreate", {path: "/fuel/create", methods: ['post']}],

        // Communication
        ["messageCreate", {path: "/msg/create", methods: ['post']}],
        ["messages", {path: "/msg", methods: ['get']}],
        ["messageDetails", {path: "/msg/", methods: ['get']}],
        ["messageSend", {path: "/msg/send", methods: ['post']}],        

        // Manual Update
        ["driversActive", {path: "/drivers/active", methods: ['get']}],
        ["activeDriversSysId", {path: "/drivers/sysid/list", methods: ['get']}],
        ["createAttendance", {path: "/drivers/manual/attendance", methods: ['post']}],        
        ["pendencyData", {path: "/report/pendency/all", methods: ["get"]}],
        ["pendencyCreateTrip", {path: "/trips/create/pendency", methods: ['post']}],
        ["pendencyUpdateTrip", {path: "/trips/pendency/loc", methods: ['put']}],    
        
        // Tansit Incidents
        ["transitList", {path: "/home/transit/list", methods: ['get']}],

        // --------------- Admin ------------- //

        // Manage Users
        ["trips", {path: "/trips/list/all", methods: ['get']}],
        ["tripDetails", {path: "/trips/", methods: ['get']}],
        ["approveLeave",{path: "/leaves/approve", methods: ['post']}],

        // Admin
        ["adminManageUsersList", {path: "/admin/masterusers", methods: ["get"]}],
        ["adminManageUsers", {path: "/admin/manageusers", methods: ["get", "post", "put"]}],
        ["adminManageUsersActive", {path: "/admin/manageusersactive", methods: ["get"]}],

        // Manage Trips
        ["adminManageTrips", {path: "/admin/trips", methods: ["post", "get", "put", "delete"]}],

        // Connect Mobile
        ["adminConnectMobileGet", {path: "/admin/tags", methods: ["get"]}],
        ["adminConnectMobile", {path: "/admin/tag", methods: ["post", "put"]}],

        // Trip Intelligence
        ["adminTripsIntel", {path: "/admin/intel", methods: ["post", "get", "put"]}],

        // Driver Roaster
        ["adminDriverRoaster", {path: "/admin/roaster", methods: ["post", "get", "put"]}],
        ["adminDriverRoasterSearch", {path: "/admin/roaster/search", methods: ["get"]}],


        // Uploade Master Data
        ["fileUpload", {path: "/admin/", methods: ["put"]}],
        
        // Vendor Registration
        ["adminManageUsersList", {path: "/admin/masterusers", methods: ["get"]}],       
        ["adminMasterData", {path: "/admin/files", methods: ["post", "get"]}],
        ["adminVendorRegistered", {path: "/admin/vendors", methods: ["post"]}],
        ["adminGetVendors", {path: "/admin/vendors", methods: ["get"]}],
        ["adminVendorsUpdate", {path: "/admin/vendors/", methods: ["put"]}],

        ["adminVendorsServiceFile", { path: "/admin/vendorsfile", methods: ["post"] }],

        ["adminVendorCreateCategoryType", {path: "/admin/master", methods: ["post"]}],
        ["adminGetTypes", {path: "/admin/master", methods: ["get"]}],
        ["adminVendorService", {path: "/admin/vendorservice", methods: ["post","get"]}],
        ["adminVendorUpdateService", {path: "/admin/vendorservice/", methods: ["put"]}],


        // --------------- Reports ------------- //

        // Master
        ["driversReport", {path: "/report/driver", methods: ["get"]}],       
        ["trailersReport", {path: "/report/trailer", methods: ["get"]}],       
        ["tripsReport", {path: "/report/trip", methods: ["get"]}],       
        ["trainingsReport", {path: "/report/training", methods: ["get"]}],       
        ["maintenanceReport", {path: "/report/maintenance", methods: ["get"]}],
        
        // Daily
        ["pendencyReport", {path: "/report/daily/pendency", methods: ["get"]}],
        ["dailyTATReport", {path: "/report/daily/tat", methods: ["get"]}],
        ["dailyTripReport", {path: "/report/daily/trip", methods: ["get"]}],
        
        // Operational
        ["dieselUtilReport", {path: "/report/operational/dieselUtilization", methods: ["get"]}],
        ["driAttReport", {path: "/report/operational/driverAttendance", methods: ["get"]}],
        ["traiPerReport", {path: "/report/operational/trailerPerformance", methods: ["get"]}],
        ["adhocMainReport", {path: "/report/operational/adhocMaintenance", methods: ["get"]}],
        ["driTrainReport", {path: "/report/operational/driverTraining", methods: ["get"]}],
        ["hireTrailReport", {path: "/report/operational/hireTrailer", methods: ["get"]}],
        ["lgrReport", {path: "/report/operational/lgr", methods: ["get"]}],
        ["driRoastReport", {path: "/report/operational/driverRoaster", methods: ["get"]}],

        ["logout", {path: "/authenticate/logout", methods: ['post']}]
    ]),

    roles: {
        40: 'Admin',
        50: 'CFSManager',
        60: 'CEO'
    },
    
    strings: {
        CFSDriversDayChart: {
            on_trip: "trips",
            shift1_present: "present",
            shift1_leave: "leave",
            shift1_absent: "absent",
            shift1_excess: "surplus"
        },
        CFSDriversNightChart: {
            on_trip: "trips",
            shift2_present: "present",
            shift2_leave: "leave",
            shift2_absent: "absent",
            shift2_excess: "surplus"
        },
        CFSTrailersChart: {
            on_idle: "Idle",
            on_maintenance: "Maintenance",
            on_move: "Move"
        },
        CEOTrailersPerformanceChart: {
            trips_done: "Trips Done",
            diesel_issued: "Diesel Issued"
        },
        CEODriversPerformanceChart: {
            driver_1: "One Trip",
            driver_2: "Two Trips",
            driver_3: "Three Trips",
            driver_4: "Four Trips"
        },
        CEOTripsPerformanceChart: {
            "planned": "Planned",
            "loaded": "Loaded",
            "empty": "Empty",
            "assigned": "Assigned",
            "completed": "Completed",
            "pending": "Pending",
            "pending_prob": "Probability"
        },

    }
};
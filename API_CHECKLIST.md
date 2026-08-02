# CarShowroom ERP API Checklist

Source: [Swagger documentation](https://kashmirinterprises.com/car_showroom/public/api/documentation#/)

Base URL: `https://kashmirinterprises.com/car_showroom/public/api`

Auth: Laravel Sanctum bearer token (`Authorization: Bearer {token}`). Register/login are public.

Implementation:
- Client: `src/api/client.ts` (auto attaches bearer token)
- Endpoints: `src/api/endpoints.ts`
- Services: `src/services/*Service.ts` (exported from `src/services/index.ts`)
- Helpers: `src/utils/apiHelpers.ts`

Total endpoints: **166** (service layer)

Legend: `[x]` implemented in app service layer · `[ ]` pending

## Screen wiring (UI → API)

### Auth & session
- [x] Login → `authService.login`
- [x] SignUp → `authService.register`
- [x] App bootstrap → `authService.getMe` + token restore
- [x] Logout (Settings / Security) → `authService.logout`

### Home
- [x] Home → `dashboardService.getDashboard` + `vehicleRentalRentalsService.listRentals` + `auditLogsService.listAuditLogs`

### Staff
- [x] Staff dashboard → `listStaff` + `listAttendance` + `listSalaries`
- [x] All Employees → `listStaff`
- [x] Add Employee → `createStaff` (FormData)
- [x] Staff Overview → `getStaffById` + attendance/salaries/bonuses/shifts

### Rentals
- [x] Rentals dashboard → `listRentals` (+ orders)
- [x] All Vehicles / View Vehicles (booked rentals) → `fetchRentals` / `GET /rentals`
- [x] New Rental → `createCustomers` + `createRentals` (+ vehicles/categories load)
- [x] Return Vehicle → `getRentalsById` + `returnRental`
- [x] Rental Invoice → `getRentalsById`
- [x] Rental Orders → `listRentOrders` + `listRentals`

### Vehicles tab
- [x] Vehicles → `fetchVehicles` (Redux `dataCache.vehicles`) shared with VehicleList / AllVehicles / NewRental / AddVehicle
- [x] Vehicle List → same vehicles cache
- [x] Add Vehicle → `createVehicles` + invalidate vehicles cache
- [x] Vehicle Detail → `getVehiclesById` + rentals from Redux cache (filtered) + maintenance
- [x] Edit Vehicle → `getVehiclesById` + `updateVehiclesById` + invalidate vehicles
- [x] Rental Vehicle wizard → customers cache + `createRentals` + invalidate rentals/vehicles

### Rentals tab
- [x] Rentals dashboard → `fetchRentals` (Redux `dataCache.rentals`)
- [x] View Vehicles → **Available vehicles** from vehicles cache (Rent → RentalVehicle wizard)
- [x] New Rental → vehicles cache (available) + create customer/rental + invalidate
- [x] Rental Orders → reuses rentals cache when present

### Settings
- [x] My Profile → `authService.getMe`
- [x] Company Profile → `settingsShowroomProfileService` get/update
- [x] Languages → `listLanguages` + settings key-value
- [x] Notifications prefs → settings key-value
- [x] Security logout → `authService.logout`
- [ ] Theme / BackupRestore — no matching backend APIs (UI local)

### Roles & audit
- [x] Roles Permissions / Manage Roles → `listRoles` + `listPermissions`
- [x] Create Role → `createRoles` (+ assign)
- [x] Role Overview / Edit Role → `getRolesById` / `updateRolesById`
- [x] Activity Log → `auditLogsService.listAuditLogs`

### Jobs & Hiring (HR UI)
- [x] Customer Jobs tab → `publicSiteJobs` list / filters / detail / apply
- [x] Showroom Open Positions + Jobs Hiring metrics → `GET /public/jobs`
- [ ] Applications / Interviews / Pipeline / Post Job create — **no recruiting admin APIs** in Swagger (only public browse + apply). Workshop `/jobs` is vehicle repair, not hiring.

### Accounting UI
- [ ] Dedicated accounting screens — services exist; no standalone accounting screens in app (customers used inside New Rental; bonuses used in Staff Overview)

---

## Accounting/Bonuses

- [x] `GET /bonuses` — List staff bonuses _(service: `accountingBonuses.listBonuses`)_
- [x] `POST /bonuses` — Record a staff bonus _(service: `accountingBonuses.createBonuses`)_
- [x] `GET /bonuses/{bonus}` — Get a single bonus _(service: `accountingBonuses.getBonusesById`)_
- [x] `PUT /bonuses/{bonus}` — Update a bonus _(service: `accountingBonuses.updateBonusesById`)_
- [x] `DELETE /bonuses/{bonus}` — Delete a bonus _(service: `accountingBonuses.deleteBonusesById`)_
- [x] `POST /bonuses/{bonus}/approve` — Approve or mark a bonus as paid _(service: `accountingBonuses.approveBonusesById`)_

## Accounting/Customers

- [x] `GET /customers` — List customers _(service: `accountingCustomers.listCustomers`)_
- [x] `POST /customers` — Create a customer _(service: `accountingCustomers.createCustomers`)_
- [x] `GET /customers/{customer}` — Get a single customer _(service: `accountingCustomers.getCustomersById`)_
- [x] `PUT /customers/{customer}` — Update a customer _(service: `accountingCustomers.updateCustomersById`)_
- [x] `DELETE /customers/{customer}` — Delete a customer _(service: `accountingCustomers.deleteCustomersById`)_

## Accounting/Expense Categories

- [x] `GET /expense-categories` — List expense categories _(service: `accountingExpenseCategories.listExpenseCategories`)_
- [x] `POST /expense-categories` — Create a new expense category _(service: `accountingExpenseCategories.createExpenseCategories`)_
- [x] `GET /expense-categories/{expenseCategory}` — Get a single expense category _(service: `accountingExpenseCategories.getExpenseCategoriesById`)_
- [x] `PUT /expense-categories/{expenseCategory}` — Update an expense category _(service: `accountingExpenseCategories.updateExpenseCategoriesById`)_
- [x] `DELETE /expense-categories/{expenseCategory}` — Delete an expense category _(service: `accountingExpenseCategories.deleteExpenseCategoriesById`)_

## Accounting/Expenses

- [x] `GET /expenses` — List expenses _(service: `accountingExpenses.listExpenses`)_
- [x] `POST /expenses` — Record a new expense _(service: `accountingExpenses.createExpenses`)_
- [x] `GET /expenses/{expense}` — Get a single expense _(service: `accountingExpenses.getExpensesById`)_
- [x] `PUT /expenses/{expense}` — Update an expense _(service: `accountingExpenses.updateExpensesById`)_
- [x] `DELETE /expenses/{expense}` — Delete an expense _(service: `accountingExpenses.deleteExpensesById`)_
- [x] `POST /expenses/{expense}/receipt` — Replace an expense receipt file _(service: `accountingExpenses.uploadReceipt`)_
- [x] `POST /expenses/{expense}/approve` — Approve or reject an expense _(service: `accountingExpenses.approveExpensesById`)_

## Accounting/Ledger

- [x] `GET /ledger` — List ledger transactions _(service: `accountingLedger.listLedger`)_
- [x] `GET /ledger/summary` — Get income/expense summary _(service: `accountingLedger.getLedgerSummary`)_

## Accounting/Purchases

- [x] `GET /purchases` — List car purchases _(service: `accountingPurchases.listPurchases`)_
- [x] `POST /purchases` — Record a car purchase _(service: `accountingPurchases.createPurchases`)_
- [x] `GET /purchases/{carPurchase}` — Get a single car purchase _(service: `accountingPurchases.getPurchasesById`)_
- [x] `PUT /purchases/{carPurchase}` — Update a car purchase _(service: `accountingPurchases.updatePurchasesById`)_
- [x] `DELETE /purchases/{carPurchase}` — Delete a car purchase _(service: `accountingPurchases.deletePurchasesById`)_

## Accounting/Sales

- [x] `GET /sales` — List car sales _(service: `accountingSales.listSales`)_
- [x] `POST /sales` — Record a car sale _(service: `accountingSales.createSales`)_
- [x] `GET /sales/{carSale}` — Get a single car sale _(service: `accountingSales.getSalesById`)_
- [x] `PUT /sales/{carSale}` — Update a car sale _(service: `accountingSales.updateSalesById`)_
- [x] `DELETE /sales/{carSale}` — Delete a car sale _(service: `accountingSales.deleteSalesById`)_

## Accounting/Suppliers

- [x] `GET /suppliers` — List suppliers _(service: `accountingSuppliers.listSuppliers`)_
- [x] `POST /suppliers` — Create a new supplier _(service: `accountingSuppliers.createSuppliers`)_
- [x] `GET /suppliers/{supplier}` — Get a single supplier _(service: `accountingSuppliers.getSuppliersById`)_
- [x] `PUT /suppliers/{supplier}` — Update a supplier _(service: `accountingSuppliers.updateSuppliersById`)_
- [x] `DELETE /suppliers/{supplier}` — Delete a supplier _(service: `accountingSuppliers.deleteSuppliersById`)_

## Audit Logs

- [x] `GET /audit-logs` — List audit log entries _(service: `auditLogs.listAuditLogs`)_

## Auth

- [x] `POST /register` — Register a new showroom (tenant) and its owner account _(service: `auth.register`)_
- [x] `POST /login` — Login and obtain a bearer token _(service: `auth.login`)_
- [x] `GET /me` — Get the currently authenticated user, roles and permissions _(service: `auth.getMe`)_
- [x] `POST /logout` — Revoke the current access token _(service: `auth.logout`)_

## Dashboard

- [x] `GET /dashboard` — Get dashboard KPI aggregates _(service: `dashboard.getDashboard`)_

## Jobs (Workshop)

- [x] `GET /jobs` — List workshop jobs _(service: `jobsworkshop.listJobs`)_
- [x] `POST /jobs` — Create a new workshop job _(service: `jobsworkshop.createJobs`)_
- [x] `GET /jobs/{job}` — Get a single workshop job _(service: `jobsworkshop.getJobsById`)_
- [x] `PUT /jobs/{job}` — Update a workshop job _(service: `jobsworkshop.updateJobsById`)_
- [x] `DELETE /jobs/{job}` — Delete a workshop job _(service: `jobsworkshop.deleteJobsById`)_

## Notifications

- [x] `GET /notifications` — List notifications for the authenticated user _(service: `notifications.listNotifications`)_
- [x] `POST /notifications/{notification}/read` — Mark a notification as read _(service: `notifications.markRead`)_
- [x] `POST /notifications/read-all` — Mark all notifications as read _(service: `notifications.markAllRead`)_
- [x] `DELETE /notifications/{notification}` — Delete a notification _(service: `notifications.deleteNotificationsById`)_

## Public Site/Auth

- [x] `POST /public/auth/register` — Register a public account (buyer/renter) _(service: `publicSiteAuth.register`)_
- [x] `POST /public/auth/login` — Login to a public account _(service: `publicSiteAuth.login`)_
- [x] `POST /public/auth/google` — Register or login with Google _(service: `publicSiteAuth.loginWithGoogle`)_
- [x] `GET /public/auth/me` — Get the currently authenticated public user _(service: `publicSiteAuth.getMe`)_
- [x] `POST /public/auth/logout` — Revoke the current public access token _(service: `publicSiteAuth.logout`)_

## Public Site/Enquiries

- [x] `POST /public/enquiries` — Send a buy/rent/general enquiry to a showroom _(service: `publicSiteEnquiries.createPublicEnquiries`)_

## Public Site/Follow

- [x] `GET /public/follows` — List the showrooms the logged-in user follows _(service: `publicSiteFollow.listPublicFollows`)_
- [x] `POST /public/follows` — Follow a showroom _(service: `publicSiteFollow.createPublicFollows`)_
- [x] `DELETE /public/follows/{showroom}` — Unfollow a showroom _(service: `publicSiteFollow.deletePublicFollowsById`)_

## Public Site/Saved Vehicles

- [x] `GET /public/saved-vehicles` — List the logged-in user's saved vehicles (wishlist) _(service: `publicSiteSavedVehicles.listPublicSavedVehicles`)_
- [x] `POST /public/saved-vehicles` — Save a vehicle to the wishlist _(service: `publicSiteSavedVehicles.createPublicSavedVehicles`)_
- [x] `DELETE /public/saved-vehicles/{vehicle}` — Remove a vehicle from the wishlist _(service: `publicSiteSavedVehicles.deletePublicSavedVehiclesById`)_

## Public Site/Showrooms

- [x] `GET /public/showrooms` — Browse public showroom storefronts (nearest-first) _(service: `publicSiteShowrooms.listPublicShowrooms`)_
- [x] `GET /public/showrooms/{slug}` — Get a single showroom storefront _(service: `publicSiteShowrooms.getPublicShowroomsById`)_

## Public Site/Vehicles

- [x] `GET /public/vehicles` — Browse public vehicle listings _(service: `publicSiteVehicles.listPublicVehicles`)_
- [x] `GET /public/vehicles/filters` — Distinct filter values for the vehicle board _(service: `publicSiteVehicles.getPublicVehiclesFilters`)_
- [x] `GET /public/vehicles/{vehicle}` — Get a single public vehicle listing _(service: `publicSiteVehicles.getPublicVehiclesById`)_

## Public Site/Jobs

- [x] `GET /public/jobs` — Browse open job posts _(service: `publicSiteJobs.listPublicJobs`)_
- [x] `GET /public/jobs/filters` — Distinct filter values for the jobs board _(service: `publicSiteJobs.getPublicJobsFilters`)_
- [x] `GET /public/jobs/{idOrSlug}` — Get a single open job post _(service: `publicSiteJobs.getPublicJobsById`)_
- [x] `POST /public/jobs/{idOrSlug}/apply` — Apply to a job post _(service: `publicSiteJobs.applyPublicJobsById`)_

## Roles & Permissions

- [x] `GET /roles` — List all roles with their permissions _(service: `rolesPermissions.listRoles`)_
- [x] `POST /roles` — Create a new role _(service: `rolesPermissions.createRoles`)_
- [x] `GET /permissions` — Get the full permission catalog _(service: `rolesPermissions.listPermissions`)_
- [x] `GET /roles/{role}` — Get a single role with its permissions _(service: `rolesPermissions.getRolesById`)_
- [x] `PUT /roles/{role}` — Update a role _(service: `rolesPermissions.updateRolesById`)_
- [x] `DELETE /roles/{role}` — Delete a role _(service: `rolesPermissions.deleteRolesById`)_
- [x] `POST /roles/assign` — Assign a role to a user _(service: `rolesPermissions.assignShift`)_

## Settings/Key-Value Settings

- [x] `GET /settings` — List key-value settings for the current showroom _(service: `settingsKeyvalueSettings.listSettings`)_
- [x] `POST /settings` — Create or update a key-value setting _(service: `settingsKeyvalueSettings.createSettings`)_
- [x] `DELETE /settings/{setting}` — Remove a key-value setting _(service: `settingsKeyvalueSettings.deleteSettingsById`)_

## Settings/Languages

- [x] `GET /languages` — List all languages _(service: `settingsLanguages.listLanguages`)_
- [x] `POST /languages` — Add a new language _(service: `settingsLanguages.createLanguages`)_
- [x] `PUT /languages/{language}` — Update an existing language _(service: `settingsLanguages.updateLanguagesById`)_
- [x] `DELETE /languages/{language}` — Remove a language _(service: `settingsLanguages.deleteLanguagesById`)_

## Settings/Public Storefront

- [x] `GET /showroom-profile/public` — Get the logged-in user's public storefront profile _(service: `settingsPublicStorefront.listShowroomProfilePublic`)_
- [x] `PUT /showroom-profile/public` — Create or update the logged-in user's public storefront profile _(service: `settingsPublicStorefront.updateShowroomProfilePublic`)_
- [x] `POST /showroom-profile/public/logo` — Replace the public storefront logo _(service: `settingsPublicStorefront.uploadLogo`)_
- [x] `POST /showroom-profile/public/cover` — Replace the public storefront cover/banner image _(service: `settingsPublicStorefront.uploadCover`)_

## Settings/Showroom Profile

- [x] `GET /showroom-profile` — Get the logged-in user's showroom profile _(service: `settingsShowroomProfile.listShowroomProfile`)_
- [x] `PUT /showroom-profile` — Update the logged-in user's showroom profile _(service: `settingsShowroomProfile.updateShowroomProfile`)_
- [x] `POST /showroom-profile/logo` — Replace the logged-in user's showroom logo _(service: `settingsShowroomProfile.uploadLogo`)_

## Staff Management/Advances

- [x] `GET /advances` — List staff advances _(service: `staffManagementAdvances.listAdvances`)_
- [x] `POST /advances` — Record a staff advance _(service: `staffManagementAdvances.createAdvances`)_
- [x] `GET /advances/{staffAdvance}` — Get a single staff advance _(service: `staffManagementAdvances.getAdvancesById`)_
- [x] `PUT /advances/{staffAdvance}` — Update a staff advance _(service: `staffManagementAdvances.updateAdvancesById`)_
- [x] `DELETE /advances/{staffAdvance}` — Delete a staff advance _(service: `staffManagementAdvances.deleteAdvancesById`)_

## Staff Management/Attendance

- [x] `GET /attendance` — List attendance records _(service: `staffManagementAttendance.listAttendance`)_
- [x] `POST /attendance` — Record an attendance entry _(service: `staffManagementAttendance.createAttendance`)_
- [x] `GET /attendance/{staffAttendance}` — Get a single attendance record _(service: `staffManagementAttendance.getAttendanceById`)_
- [x] `PUT /attendance/{staffAttendance}` — Update an attendance record _(service: `staffManagementAttendance.updateAttendanceById`)_
- [x] `DELETE /attendance/{staffAttendance}` — Delete an attendance record _(service: `staffManagementAttendance.deleteAttendanceById`)_

## Staff Management/Salaries

- [x] `GET /salaries` — List salary records _(service: `staffManagementSalaries.listSalaries`)_
- [x] `POST /salaries` — Create a salary record _(service: `staffManagementSalaries.createSalaries`)_
- [x] `GET /salaries/{salary}` — Get a single salary record _(service: `staffManagementSalaries.getSalariesById`)_
- [x] `PUT /salaries/{salary}` — Update a salary record _(service: `staffManagementSalaries.updateSalariesById`)_
- [x] `DELETE /salaries/{salary}` — Delete a salary record _(service: `staffManagementSalaries.deleteSalariesById`)_

## Staff Management/Shifts

- [x] `GET /shifts` — List shifts _(service: `staffManagementShifts.listShifts`)_
- [x] `POST /shifts` — Create a shift _(service: `staffManagementShifts.createShifts`)_
- [x] `GET /shifts/{shift}` — Get a single shift _(service: `staffManagementShifts.getShiftsById`)_
- [x] `PUT /shifts/{shift}` — Update a shift _(service: `staffManagementShifts.updateShiftsById`)_
- [x] `DELETE /shifts/{shift}` — Delete a shift _(service: `staffManagementShifts.deleteShiftsById`)_
- [x] `POST /shifts/{shift}/assign` — Assign a staff member to a shift _(service: `staffManagementShifts.assignShift`)_

## Staff Management/Staff

- [x] `GET /staff` — List staff members _(service: `staffManagementStaff.listStaff`)_
- [x] `POST /staff` — Create a staff member _(service: `staffManagementStaff.createStaff`)_
- [x] `GET /staff/{staff}` — Get a single staff member _(service: `staffManagementStaff.getStaffById`)_
- [x] `PUT /staff/{staff}` — Update a staff member _(service: `staffManagementStaff.updateStaffById`)_
- [x] `DELETE /staff/{staff}` — Delete a staff member _(service: `staffManagementStaff.deleteStaffById`)_
- [x] `POST /staff/{staff}/photo` — Replace a staff member photo _(service: `staffManagementStaff.uploadPhoto`)_
- [x] `POST /staff/{staff}/documents` — Add documents to a staff member _(service: `staffManagementStaff.uploadDocuments`)_

## Super Admin/Platform Dashboard

- [x] `GET /super-admin/dashboard` — Get platform-wide dashboard KPIs _(service: `superAdminPlatformDashboard.listSuperAdminDashboard`)_

## Super Admin/Showrooms

- [x] `GET /super-admin/showrooms` — List showrooms (tenants) _(service: `superAdminShowrooms.listSuperAdminShowrooms`)_
- [x] `POST /super-admin/showrooms` — Create a new showroom (tenant) _(service: `superAdminShowrooms.createSuperAdminShowrooms`)_
- [x] `GET /super-admin/showrooms/{showroom}` — Get a single showroom _(service: `superAdminShowrooms.getSuperAdminShowroomsById`)_
- [x] `PUT /super-admin/showrooms/{showroom}` — Update a showroom _(service: `superAdminShowrooms.updateSuperAdminShowroomsById`)_
- [x] `DELETE /super-admin/showrooms/{showroom}` — Delete a showroom _(service: `superAdminShowrooms.deleteSuperAdminShowroomsById`)_
- [x] `POST /super-admin/showrooms/{showroom}/status` — Set a showroom status _(service: `superAdminShowrooms.setStatus`)_

## Super Admin/Subscription Plans

- [x] `GET /super-admin/plans` — List subscription plans _(service: `superAdminSubscriptionPlans.listSuperAdminPlans`)_
- [x] `POST /super-admin/plans` — Create a subscription plan _(service: `superAdminSubscriptionPlans.createSuperAdminPlans`)_
- [x] `GET /super-admin/plans/{subscriptionPlan}` — Get a single subscription plan _(service: `superAdminSubscriptionPlans.getSuperAdminPlansById`)_
- [x] `PUT /super-admin/plans/{subscriptionPlan}` — Update a subscription plan _(service: `superAdminSubscriptionPlans.updateSuperAdminPlansById`)_
- [x] `DELETE /super-admin/plans/{subscriptionPlan}` — Delete a subscription plan _(service: `superAdminSubscriptionPlans.deleteSuperAdminPlansById`)_

## Super Admin/Subscriptions

- [x] `GET /super-admin/subscriptions` — List subscriptions _(service: `superAdminSubscriptions.listSuperAdminSubscriptions`)_
- [x] `POST /super-admin/subscriptions` — Create a subscription _(service: `superAdminSubscriptions.createSuperAdminSubscriptions`)_
- [x] `GET /super-admin/subscriptions/{subscription}` — Get a single subscription _(service: `superAdminSubscriptions.getSuperAdminSubscriptionsById`)_
- [x] `PUT /super-admin/subscriptions/{subscription}` — Update a subscription _(service: `superAdminSubscriptions.updateSuperAdminSubscriptionsById`)_
- [x] `DELETE /super-admin/subscriptions/{subscription}` — Delete a subscription _(service: `superAdminSubscriptions.deleteSuperAdminSubscriptionsById`)_

## Vehicle Management/Categories

- [x] `GET /categories` — List car categories _(service: `vehicleManagementCategories.listCategories`)_
- [x] `POST /categories` — Create a new car category _(service: `vehicleManagementCategories.createCategories`)_
- [x] `GET /categories/{carCategory}` — Get a single car category _(service: `vehicleManagementCategories.getCategoriesById`)_
- [x] `PUT /categories/{carCategory}` — Update a car category _(service: `vehicleManagementCategories.updateCategoriesById`)_
- [x] `DELETE /categories/{carCategory}` — Delete a car category _(service: `vehicleManagementCategories.deleteCategoriesById`)_
- [x] `POST /categories/{carCategory}/image` — Replace a car category image _(service: `vehicleManagementCategories.uploadImage`)_

## Vehicle Management/Maintenance

- [x] `GET /vehicles/{vehicle}/maintenance` — List maintenance logs for a vehicle _(service: `vehicleManagementMaintenance.getVehiclesByIdMaintenance`)_
- [x] `POST /vehicles/{vehicle}/maintenance` — Create a maintenance log entry _(service: `vehicleManagementMaintenance.createVehiclesByIdMaintenance`)_

## Vehicle Management/Vehicles

- [x] `GET /vehicles` — List vehicles _(service: `vehicleManagementVehicles.listVehicles`)_
- [x] `POST /vehicles` — Create a new vehicle _(service: `vehicleManagementVehicles.createVehicles`)_
- [x] `GET /vehicles/{vehicle}` — Get a single vehicle _(service: `vehicleManagementVehicles.getVehiclesById`)_
- [x] `PUT /vehicles/{vehicle}` — Update a vehicle _(service: `vehicleManagementVehicles.updateVehiclesById`)_
- [x] `DELETE /vehicles/{vehicle}` — Delete a vehicle _(service: `vehicleManagementVehicles.deleteVehiclesById`)_
- [x] `POST /vehicles/{vehicle}/images` — Add images to a vehicle _(service: `vehicleManagementVehicles.uploadImages`)_
- [x] `DELETE /vehicles/{vehicle}/images/{image}` — Delete a vehicle image _(service: `vehicleManagementVehicles.deleteImage`)_
- [x] `POST /vehicles/{vehicle}/documents` — Add documents to a vehicle _(service: `vehicleManagementVehicles.uploadDocuments`)_
- [x] `DELETE /vehicles/{vehicle}/documents/{document}` — Delete a vehicle document _(service: `vehicleManagementVehicles.deleteDocument`)_

## Vehicle Rental/Rent Orders

- [x] `GET /rent-orders` — List rent orders (advance bookings) _(service: `vehicleRentalRentOrders.listRentOrders`)_
- [x] `POST /rent-orders` — Create a rent order (advance booking) _(service: `vehicleRentalRentOrders.createRentOrders`)_
- [x] `GET /rent-orders/{rentOrder}` — Get a single rent order _(service: `vehicleRentalRentOrders.getRentOrdersById`)_
- [x] `PUT /rent-orders/{rentOrder}` — Update a rent order _(service: `vehicleRentalRentOrders.updateRentOrdersById`)_
- [x] `DELETE /rent-orders/{rentOrder}` — Delete a rent order _(service: `vehicleRentalRentOrders.deleteRentOrdersById`)_

## Vehicle Rental/Rentals

- [x] `GET /rentals` — List rentals (active vehicle hand-overs) _(service: `vehicleRentalRentals.listRentals`)_
- [x] `POST /rentals` — Rent out a vehicle (create rental / vehicle hand-over) _(service: `vehicleRentalRentals.createRentals`)_
- [x] `GET /rentals/{rental}` — Get a single rental _(service: `vehicleRentalRentals.getRentalsById`)_
- [x] `PUT /rentals/{rental}` — Update a rental _(service: `vehicleRentalRentals.updateRentalsById`)_
- [x] `DELETE /rentals/{rental}` — Delete a rental _(service: `vehicleRentalRentals.deleteRentalsById`)_
- [x] `POST /rentals/{rental}/return` — Return a rented vehicle and settle the rental _(service: `vehicleRentalRentals.returnRental`)_

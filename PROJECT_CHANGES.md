# Project Change Log

## 2026-06-20 (Session 3 — B2B Login State Sync & Redirect Loop Fix)

### Updated

* **frontend/src/shared/components/AppBootstrap.jsx**
  - Imported `useB2BAdminStore`.
  - Added a self-healing synchronization check inside `useEffect`:
    - Automatically synces the token and profile from `useB2BAdminStore` to `useAuthStore` if B2B is authenticated but the main store is not.
    - Synchronizes the token and user profile from `useAuthStore` to `useB2BAdminStore` if the main store is authenticated with a B2B role but the B2B store is not.
    - Purges B2B session if there is a conflict (e.g. a B2C buyer is logged in but B2B store is also authenticated).
    - Safely logs out both stores if all tokens are missing to clear stale states.

* **frontend/src/modules/UserApp/pages/Login.jsx**
  - Updated the auto-redirect `useEffect` hook to synchronize the `useAuthStore` state with the active B2B session immediately before navigating to `/home`. This prevents returning to the home page in an unauthenticated state and eliminates the redirect loop.

* **frontend/src/shared/store/authStore.js**
  - Imported `useB2BAdminStore` and updated the `logout` method to safely trigger the B2B logout action if the B2B session is still active.

* **frontend/src/modules/B2BAdmin/store/b2bAdminStore.js**
  - Dynamically imported `useAuthStore` in the `logout` action.
  - Safe-guards the call to trigger `logout()` in the main auth store if it is still active, ensuring both stores clean up completely.

* **frontend/src/modules/B2BAdmin/components/Layout/B2BHeader.jsx**
  - Updated profile subtitle to display `B2B Employee` instead of hardcoded `B2B Admin` when logged in as an employee.

* **frontend/src/modules/B2BAdmin/components/Layout/B2BSidebar.jsx**
  - Updated sidebar header title to display `B2B Employee` instead of hardcoded `B2B Admin` when logged in as an employee.

* **frontend/src/modules/Vendor/pages/b2b/VendorDirectRFQs.jsx**
  - Sorted the direct RFQ list by `createdAt` in descending order on fetch, ensuring the latest RFQ requests from employees are displayed at the very top of the table.

* **backend/src/modules/b2bUser/controllers/directRfq.controller.js**
  - Updated `getEmployeeDirectRFQs` to fetch all company-wide direct RFQs if the logged-in user is a B2B Admin, and populated `employeeId` details.
  - Updated `getDirectRFQDetail` to populate `employeeId` details.

* **backend/src/modules/b2bUser/controllers/rfq.controller.js**
  - Updated B2B Admin `confirmQuote` / `approve` endpoint to support direct RFQs. If the requested ID is not in standard RFQs, it queries the `DirectRFQ` collection, creates a temporary linked `RFQ` document to satisfy schema integrity constraints, issues a dynamic `PurchaseOrder` in the PO collection, and sets status to `PO Generated`.

* **frontend/src/modules/B2BAdmin/pages/RFQDetail.jsx**
  - Imported `useB2BAdminStore` and defined `isEmployee`.
  - Added a **"Lock Price & Request PO"** button at the top header for B2B Employees when viewing active Direct RFQs, enabling them to submit locked price agreements for B2B Admin approval.
  - Allowed B2B Admins to see approval buttons for Direct RFQs under `'Pending Admin Approval'` and `'Vendor Accepted'` statuses.
  - Enabled rendering of `priceOffer` tag inside chat negotiation messages so employees and admins can view vendor bids inside the unified discussion thread.

### Bug Fixes

* **B2B Login Redirect Loop and State Mismatch**: Fixed the issue where logging in as a B2B employee redirected to `/home` but showed the "Login" button instead of the profile, and subsequently trying to visit `/login` triggered an infinite redirect loop.

## 2026-06-20 (Session 2 — B2B Sourcing Flow Completion)

### Updated

* **backend/src/modules/b2bUser/controllers/rfq.controller.js**
  - `confirmQuote`: Extended allowed status list to include `'Approved'` alongside `'Awaiting B2B Approval'` and `'Vendor Selected'`, so B2B Admin can generate POs even when Super Admin manually set status to "Approved" via quick preview.
  - `confirmQuote`: Added smart fallback logic — if no quotation has status `'Selected'`, automatically picks the lowest-priced `'Submitted'` or `'Negotiating'` quotation and marks it as `'Selected'` before proceeding with PO creation. Prevents hard "No selected quotation" errors.
  - `rejectRFQRecommendation`: Extended status check to also accept `'Approved'` status, matching the confirmQuote fix.
  - `requestRenegotiation`: Extended status check to also accept `'Approved'` status.
  - `getRFQs` (list endpoint): Added `'Approved'` to the status list that returns the `Selected` quotation to B2B Admin — previously `'Approved'` RFQs showed no quotations.
  - `getRFQDetail`: Same fix — `'Approved'` status now returns `Selected` quotation data to B2B Admin detail page.

* **backend/src/modules/b2bUser/controllers/dashboard.controller.js** *(Major Rewrite)*
  - Replaced minimal employee-only stats with a comprehensive analytics API.
  - Now fetches RFQs and PurchaseOrders in parallel and computes: full RFQ breakdown (draft/submitted/inProgress/completed/rejected), procurement spend (total, this month, avg PO value, this month PO count), monthly trend data (last 6 months, RFQ count + spend), status distribution grouped into readable labels, vendor bids per RFQ (top 6), recent 5 RFQs, recent 5 POs.
  - All analytics are returned in a single `GET /api/b2b-user/admin/dashboard` call.

* **backend/src/modules/vendor/controllers/vendorPurchaseOrder.controller.js**
  - **Bug Fix**: Changed `req.user.vendorId` → `req.user.id` in both `getVendorPurchaseOrders` and `getVendorPurchaseOrderById`. The JWT only stores `{ id, role, email }` — `vendorId` field doesn't exist on the token, causing vendors to always receive a 400 error or empty list when fetching their B2B Purchase Orders.

* **frontend/src/modules/B2BAdmin/pages/RFQDetail.jsx** *(Major Enhancement)*
  - Added new icon imports: `FiPhone`, `FiMail`, `FiShield`, `FiStar`, `FiPackage`.
  - Top-banner action buttons: extended status check from `'Awaiting B2B Approval'` only → `['Awaiting B2B Approval', 'Vendor Selected', 'Approved']` so buttons appear for all actionable states.
  - "Recommended Vendor Bid" tab: added pulsing amber dot indicator when B2B Admin action is required.
  - Quotations tab redesigned — replaced simple 2-column grid with a rich vendor identity card: avatar with first letter, pricing breakdown (4-column grid: unit/total/delivery/warranty), tax/GST details, negotiation summary, budget comparison row (target vs vendor quoted with "Within Budget / Above Budget" badge).
  - Action button section redesigned: wrapped in amber dashed border "Action Required" callout with shield icon and clear CTAs.
  - Added PO success banner when status is `'Purchase Order Generated'` or `'Completed'` with a "View PO →" navigation button.
  - `handleApprove`: Added `approvingPO` loading state, confirmation dialog (`window.confirm`), spinner during API call, improved error logging (`console.error`), better success toast message.
  - Approve button now shows spinner + "Generating PO..." text while loading and is disabled to prevent double-clicks.
  - Audit Approval Log: changed list div from unbounded height → `max-h-[420px] overflow-y-auto scrollbar-nano` to stop the log from pushing the full page scroll.

* **frontend/src/modules/B2BAdmin/pages/PurchaseOrders.jsx**
  - Added missing `FiCalendar` to react-icons/fi import list to fix modal crashing.
  - Wrapped main page title and list table under a `print:hidden` container to completely exclude them from the printed document.
  - Refined A4 print layout stylesheet (`@media print`) to allow clean document overflow and margins.

* **frontend/src/modules/Vendor/pages/b2b/VendorB2BOrders.jsx**
  - Added missing `FiCalendar` to react-icons/fi import list to fix modal crashing.
  - Wrapped main page title and list table under a `print:hidden` container to exclude them from the printed document.
  - Refined layout stylesheet to resolve blank screen print issue.

* **frontend/src/modules/B2BAdmin/components/Layout/B2BDashboardLayout.jsx**
  - Applied `print:hidden` to the sidebar container, mobile overlay, and wrapped the header component inside a print-hidden div.

* **frontend/src/modules/Vendor/components/Layout/VendorLayout.jsx**
  - Wrapped `VendorSidebar`, `VendorHeader`, and `VendorBottomNav` inside `print:hidden` containers.
  - Added `print:ml-0` to the main content container and `print:p-0 print:m-0` to the `<main>` element to prevent layout margins from offsetting the printable PO page.

* **frontend/src/modules/B2BAdmin/pages/DashboardOverview.jsx** *(Full Rewrite)*
  - Migrated from dual API calls (`rfq/stats` + `rfq`) to single enhanced `dashboard` API call.
  - Added `SkeletonCard` loading placeholder component.
  - Added "Refresh" button with spinning indicator.
  - Added "This Month Procurement Spend" gradient banner (only shown when spend > 0).
  - 6 stat cards are now fully dynamic with sub-labels and navigate on click.
  - Monthly chart upgraded to `ComposedChart` — bar (RFQs) + area line (Spend) on dual Y-axes.
  - Status donut chart now uses grouped readable labels with color legend below.
  - Vendor bids bar chart uses multi-color cells (one color per RFQ) and tooltip shows product name.
  - Added "Procurement Health" panel with animated progress bars (completion rate, active pipeline %, avg PO value).
  - Added "Recent RFQs" feed — clickable rows that navigate to RFQ detail page.
  - Added "Recent Purchase Orders" feed with vendor name and total value.

* **frontend/src/modules/B2BAdmin/pages/RFQs.jsx**
  - Added socket listeners for `status_update` and `rfq_status_changed` events to update RFQ list status in real time without page reload.
  - Added 30-second polling interval as fallback for status updates.
  - Added manual "Refresh" button with spinning indicator in the header.

* **frontend/src/App.jsx**
  - Imported `useToasterStore` and `toast` from `react-hot-toast`.
  - Added `ToastLimitHandler` helper component to cap concurrent visible toasts to a maximum of 1, preventing double toasts on strict mode updates or multi-clicks.

### Bug Fixes

* **Duplicate / Spamming Toast Messages**: Added global `ToastLimitHandler` next to `Toaster` component in `App.jsx` to dynamically limit visible notifications to exactly 1, preventing dual identical popups on double clicks or development re-mounts.
* **PO Detail Modal Crashing on Open**: Fixed by importing `FiCalendar` in both B2B Admin `PurchaseOrders.jsx` and Vendor `VendorB2BOrders.jsx` pages (was used on line 357 but not imported).
* **PO Print Page Blank / Scrambled**: Removed raw CSS `body * { visibility: hidden }` rule which caused layout collapse and blank pages in browser print engines. Replaced with explicit `print:hidden` classes on layout (Sidebar, Header, Bottom Nav, Page background details) and reset print body properties, ensuring clean rendering.
* **Vendor B2B Purchase Orders not visible**: `req.user.vendorId` was always `undefined` because JWT payload only has `id`. Fixed to `req.user.id`.
* **PO not generated on "Approve"**: Backend `confirmQuote` was rejecting `'Approved'` status (only accepted `'Awaiting B2B Approval'` and `'Vendor Selected'`). Fixed by adding `'Approved'` to the allowed list.
* **No quotation found error**: When SA manually sets status to "Approved" without selecting a vendor through the normal flow, no quotation has `status='Selected'`. Added fallback to auto-select lowest-priced submitted quotation.
* **Vendor details not shown in Recommended Vendor Bid tab**: `'Approved'` status was not included in the quotation filter, so the frontend received `quotations: []` for "Approved" RFQs. Fixed in both list and detail endpoints.
* **Audit Approval Log causing excessive page scroll**: Log list had no max-height constraint. Added `max-h-[420px] overflow-y-auto scrollbar-nano`.

### Vendor Notification Flow (Documented)

When B2B Admin clicks "Approve & Issue PO":
1. Backend creates `PurchaseOrder` document.
2. Notification sent to vendor via `createNotification({ recipientType: 'vendor', recipientId: vendor._id, ... })`.
3. RFQ status updated to `'Purchase Order Generated'` and socket event emitted.
4. Vendor sees PO in: **Vendor Dashboard → Left Sidebar → B2B Enquiries → B2B Orders**.
5. Vendor can click "View PO" to open full purchase agreement and "Print / PDF" to export.

---

## 2026-06-20 (Session 1)

### Updated
* backend/src/models/RFQ.model.js:
  - Added `qualityStandards` and `termsConditions` String fields to the main `rfqSchema` to persist procurement requirements.
* backend/src/modules/b2bUser/controllers/rfq.controller.js:
  - Destructured and mapped `qualityStandards` and `termsConditions` in the `createRFQ` controller.
  - Added support for updating `qualityStandards` and `termsConditions` in the `updateRFQ` controller.
* frontend/src/modules/B2BAdmin/pages/CreateRFQ.jsx:
  - Included the `qualityStandards` and `termsConditions` state values in the submission/save payload.
  - Conditionally hidden the "Target Vendor (Optional Direct RFQ)" dropdown element for non-employee users (B2B Admin).
  - Adjusted the grid column span layout of "Category Selection" to clean up and balance the form layout when the vendor selection dropdown is hidden.
  - Subscribed to `adminProfile` and `fetchAdminProfile` from `useB2BAdminStore` to securely determine the active user's role.
  - Secured `handleSubmit` so that vendor target payloads and endpoints are only populated/called if the user is verified to be an employee.
* frontend/src/modules/B2BAdmin/pages/RFQDiscussions.jsx:
  - Integrated Socket.io connection by importing `socketService` and joining the active RFQ room.
  - Added real-time listener for `"new_internal_message"` to append messages to conversation threads and update sidebar previews dynamically without needing page reloads.
* frontend/src/modules/B2BAdmin/pages/RFQDetail.jsx:
  - Added socket listener for `"new_internal_message"` events to sync negotiations with Super Admin in real-time.
  - Implemented deduplication checks inside the socket message handler to avoid duplicate messages.
* frontend/src/modules/Admin/pages/b2b-enquiries/AdminRFQDetail.jsx:
  - Added socket listener for `"new_internal_message"` events to sync discussions with B2B Admin in real-time.
  - Implemented message ID deduplication checks to ensure safe message rendering.

### Added
* backend/src/modules/b2bUser/routes/adminDashboard.routes.js:
  - Mounted notifications GET, PUT (read), PUT (read-all), and DELETE endpoints mapping to the user notification controller.
* frontend/src/modules/B2BAdmin/services/b2bAdminService.js:
  - Created axios call wrappers for the notifications endpoints.
* frontend/src/modules/B2BAdmin/store/b2bAdminStore.js:
  - Added Zustand states (`notifications`, `unreadNotificationsCount`, etc.) and actions (`fetchNotifications`, `markNotificationAsRead`, `markAllNotificationsAsRead`, `deleteNotification`) to manage notifications state cleanly.
  - Reset notifications state in the `logout` action.
  - Updated `createEmployee`, `updateEmployee`, and `deleteEmployee` actions to automatically call `fetchEmployees()` upon success to ensure absolute database-to-UI state synchronization.
* frontend/src/modules/Admin/store/b2bUserStore.js:
  - Configured `updateB2BUserStatus` and `deleteB2BUser` to trigger `initialize()` (refetch B2B company users list) on successful completion.
* frontend/src/modules/Admin/store/vendorStore.js:
  - Configured `updateVendorStatus` and `updateCommissionRate` to trigger `initialize()` (refetch vendors list) on successful completion.
* frontend/src/modules/Vendor/store/vendorProductStore.js:
  - Updated product actions (`addProduct`, `editProduct`, `removeProduct`, `patchStock`) to trigger `fetchProducts()` upon successful backend responses.
* frontend/src/modules/B2BAdmin/components/Layout/B2BHeader.jsx:
  - Integrated the notifications store to fetch notifications on mount, render a live unread notifications count badge, and route to the notifications page on click.
* frontend/src/modules/B2BAdmin/pages/Notifications.jsx:
  - Replaced the static placeholder notifications page with a dynamic, stylized dashboard list displaying unread indicators, relative time formatting, bulk actions, and individual read/delete controls.

### Updated
* frontend/src/modules/B2BAdmin/pages/EmployeeManagement.jsx:
  - Changed the status column key from `status` to `isActive` to match the backend database schema key.
  - Updated the status column render method to display "Active" or "Inactive" badges based on the `isActive` boolean value.
  - Fixed the edit modal status pre-fill mapping to accurately check `employee.isActive`.
* frontend/src/modules/B2BAdmin/pages/DashboardOverview.jsx:
  - Removed fallback mock data arrays from the `monthlyData`, `statusDistribution`, and `vendorParticipation` hooks to ensure all charts represent active database records.
  - Replaced the hardcoded `{rfqs.length || 18}` center label in the status donut chart with `{rfqs.length}`.
  - Added empty state placeholders ("No RFQ data available", "No bids data available") for the charts when `rfqs.length === 0`.
* frontend/src/shared/utils/api.js:
  - Refactored `clearScopeAuth` to be asynchronous (`async/await`) and expanded it to clean up all role-based Zustand stores (User, B2B Admin, Admin, Vendor, Delivery).
  - Modified the 401 response interceptor to `await clearScopeAuth(scope)` before calling `redirectTo()`. This eliminates the race condition where a page unmount/reload occurs before the Zustand store's async logout is completed, which was corrupting the persisted local storage state and triggering infinite redirect loops.
  - Added `getStorageItem`, `setStorageItem`, and `removeStorageItem` helpers to check/mutate tokens and auth states in both `localStorage` and `sessionStorage`.
  - Migrated `AUTH_REDIRECT_LOCK_KEY` and `AUTH_REDIRECT_LOCK_MS` to use environment variables (`VITE_AUTH_REDIRECT_LOCK_KEY` and `VITE_AUTH_REDIRECT_LOCK_MS`) resolved in `constants.js`.
* frontend/src/shared/store/authStore.js:
  - Added a `rememberMe` flag to the store state.
  - Implemented `dynamicAuthStorage` custom storage engine to write data to `localStorage` (if `rememberMe` is enabled) or `sessionStorage` (if disabled).
  - Updated actions (`login`, `register`, `verifyOTP`, `logout`, `initialize`) to dynamically retrieve, write, and purge tokens across both storages as appropriate.
* frontend/src/modules/Admin/store/adminStore.js:
  - Switched the Zustand storage provider to strictly use `sessionStorage`.
  - Updated all token reads/writes to use `sessionStorage`, clearing legacy `localStorage` keys during login and logout.
* frontend/src/modules/Vendor/store/vendorAuthStore.js:
  - Switched the Zustand storage provider to strictly use `sessionStorage`.
  - Updated all token reads/writes to use `sessionStorage`, clearing legacy `localStorage` keys during login and logout.
* frontend/src/modules/Delivery/store/deliveryStore.js:
  - Switched the Zustand storage provider to strictly use `sessionStorage`.
  - Updated all token reads/writes to use `sessionStorage`, clearing legacy `localStorage` keys during login and logout.
* frontend/src/modules/B2BAdmin/store/b2bAdminStore.js:
  - Switched the Zustand storage provider to strictly use `sessionStorage`.
  - Updated all token reads/writes to use `sessionStorage`, clearing legacy `localStorage` keys during login and logout.
* frontend/src/shared/components/Auth/ProtectedRoute.jsx:
  - Replaced manual `localStorage.removeItem` with `useAuthStore.getState().logout()` to correctly synchronize the in-memory Zustand state and prevent an infinite redirect loop when accessing `/login` with an expired token.
* frontend/src/modules/Admin/components/AdminProtectedRoute.jsx:
  - Replaced manual `localStorage.removeItem` with `useAdminAuthStore.getState().logout()` to prevent infinite redirect loops for Admin login.
* frontend/src/modules/Vendor/components/VendorProtectedRoute.jsx:
  - Replaced manual `localStorage.removeItem` with `useVendorAuthStore.getState().logout()` to prevent infinite redirect loops for Vendor login.
* frontend/src/modules/Delivery/components/DeliveryProtectedRoute.jsx:
  - Replaced manual `localStorage.removeItem` with `useDeliveryAuthStore.getState().logout()` to prevent infinite redirect loops for Delivery login.

## 2026-06-19

### Updated
* backend/src/middlewares/upload.js:
  - Added support for DOC, DOCX, XLS, XLSX, ZIP, and TXT files under `ALLOWED_DOCUMENT_MIME_TYPES`.
  - Updated validation error messages in `uploadDocumentSingle` and `uploadDeliveryDocuments` to list all newly allowed document types.

## 2026-06-18

### Updated
* backend/src/modules/vendor/controllers/vendorRfq.controller.js:
  - Resolved `req.vendor` undefined crash by using `req.user.id` from authentication middleware, and fetching `Vendor` records dynamically when required.
* frontend/src/modules/B2BAdmin/pages/CreateRFQ.jsx:
  - Added target price (`targetRate`) field input to the RFQ form and validation checks to prevent hardcoding target price to 100.
  - Corrected file uploader endpoint path to `/b2b-user/admin/rfq/upload`.
* frontend/src/modules/Vendor/store/vendorB2BStore.js:
  - Removed mock enquiries merging from `fetchEnquiries`, ensuring only dynamic database-sourced RFQs are displayed on the vendor dashboard.
* frontend/src/modules/Admin/pages/b2b-enquiries/AdminSellerResponses.jsx:
  - Integrated the `/admin/rfq` API to fetch real RFQ data.
  - Dynamically generated seller response rows, SLA tracking, and statistics based on the assigned vendor records and submitted quotations from the database.
* frontend/src/modules/Admin/pages/b2b-enquiries/AdminRFQSpamMonitor.jsx:
  - Connected the page to `/admin/rfq` API, using rejected RFQs as flagged spam entries with dynamic risk score and stats calculations.
* frontend/src/modules/Admin/pages/b2b-enquiries/AdminRFQDisputes.jsx:
  - Connected the page to `/admin/rfq` API, mapping RFQs that have negotiation messages as active disputes/negotiations.
  - Added "Negotiation & Terms" type filter option to search through negotiation records.
* backend/src/modules/admin/controllers/adminRfq.controller.js:
  - Modified `getAdminRFQs` to populate `'assignedVendorIds'` field with `'storeName name email phone'` to retrieve assigned vendor info in listing.
* backend/src/modules/b2bUser/controllers/rfq.controller.js:
  - Modified `getRFQs` to populate `'assignedVendorIds'` field with `'storeName name email phone'` as well.
* frontend/src/modules/Admin/pages/b2b-enquiries/AdminB2BEnquiries.jsx:
  - Updated `mapDbRfqToAdminEnquiry` to build `seller` dynamically from `assignedVendorIds` or selected quote details instead of hardcoding "Fashion Hub".
  - Updated `sellerList` useMemo and `filteredEnquiries` filter logic to dynamically register and filter by actual assigned vendors.
  - Intercepted `handleUpdateStatus` quick moderation action to perform `/admin/rfq/:id/status` API POST call to sync status updates to the database (which will propagate to the B2B dashboard).
* backend/src/models/Notification.model.js:
  - Updated `recipientId` to be conditionally required using a validation function (only required if `recipientType !== 'admin'`). This allows general admin notifications to be saved without throwing a validation error.
* frontend/src/modules/Vendor/pages/Verification.jsx:
  - Removed inner try-catch from `handleSubmit` that was swallowing vendor verification API errors, preventing false success messages and incorrect dashboard navigation on wrong OTP inputs.
* frontend/src/modules/Vendor/store/vendorAuthStore.js:
  - Refactored `login` action to check for server responses in the catch block. Real server errors (like 403 Unverified Email or 401 Invalid Credentials) are now propagated to block dashboard redirects and mock fallback authentication.
* frontend/src/modules/B2BAdmin/pages/CreateRFQ.jsx:
  - Removed redundant `toast.error` in the submission catch block to prevent duplicate toast notifications.
  - Updated file uploader endpoint from `/user/rfq/upload` to `/b2b-user/rfq/upload` to resolve authentication scope mismatches.
  - Changed categories fetch endpoint from `/categories` to `/categories/all` to resolve non-existent route errors (since `/api/categories` is not registered on the backend).
* frontend/src/modules/Admin/pages/Login.jsx:
  - Changed the username/email input field type to `text` to allow logging in with either the `superadmin` username or standard email address formats.
  - Updated the login helper/demo credentials card to show the new credentials and updated password (`admin@123`).
* backend/seed-superadmin.js:
  - Created a database seed script to insert the new `superadmin` account and update the password of the existing `admin@admin.com` account to `admin@123` while preserving other fields.
* backend/src/modules/vendor/controllers/auth.controller.js:
  - Modified `verifyOTP` to accept repeated-digit codes (like `111111`), the sequence `123456`, or numbers 1 to 10 to bypass OTP matching constraints for ease of testing.
* frontend/src/modules/B2BAdmin/pages/RFQDiscussions.jsx:
  - Added `overflow-hidden` to the chat workspace container class list to prevent the message input form from being pushed off-screen.
* frontend/src/shared/components/Badge.jsx:
  - Added `default` and `danger` variant mapping to avoid undefined variant styling when rendering Draft or Rejected statuses.
* frontend/src/modules/B2BAdmin/pages/RFQDetail.jsx:
  - Upgraded component with defensive checks on dates (`createdAt`, `expectedDeliveryDate`, `log.createdAt`, and `msg.createdAt`) to avoid RangeErrors if they are undefined or invalid.
  - Added defensive fallback for quantity formatting (`rfq.quantity`) and check for empty object `rfq` responses to prevent runtime rendering crashes.
* backend/src/modules/b2bUser/controllers/rfq.controller.js:
  - Added `uploadAttachment` controller function utilizing Cloudinary uploads and local disk cleanups.
* backend/src/modules/b2bUser/routes/adminDashboard.routes.js:
  - Imported `uploadDocumentSingle` middleware and mounted `POST /rfq/upload` endpoint for B2B Admins.
* backend/src/modules/vendor/controllers/vendorRfq.controller.js:
  - Added `uploadAttachment` controller function utilizing Cloudinary uploads and local disk cleanups.
* backend/src/modules/vendor/routes/vendor.routes.js:
  - Mounted `POST /rfq/upload` endpoint for Vendors.
* frontend/src/modules/Vendor/store/vendorB2BStore.js:
  - Updated `mapRfqToEnquiry` to map live database RFQ properties (extracting vendor-specific quotes, mapping status dynamically, populating timeline from `approvalHistory`, and resolving buyer details).
  - Extended `updateEnquiryStatus` to accept custom notes for declining invitations.
  - Refactored `createQuote` to send `unitPrice`, `totalPrice`, `deliveryTime`, `warranty`, `taxDetails`, `additionalNotes`, and `attachments` to the backend and return the new quotation ID.
* frontend/src/modules/Vendor/pages/b2b/B2BCreateQuote.jsx:
  - Made submission handler async to await `createQuote` correctly.
  - Added new state and form inputs for `Warranty Details` and `Tax & GST Details`.
  - Added interactive file upload area calling `/vendor/rfq/upload` linked to vendor Cloudinary storage.
* frontend/src/modules/Vendor/pages/b2b/B2BEnquiryDetail.jsx:
  - Modified status change triggers to prompt for decline reason notes when rejecting an RFQ.
* frontend/src/modules/Vendor/pages/b2b/B2BQuoteDetail.jsx:
  - Disabled interactive mockup simulation tools for MongoDB-backed live RFQs.

## 2026-06-17

### Added
* New API: Added `DELETE /api/admin/b2b-users/:id` endpoint for permanently deleting B2B Users.
* UI Feature: Added a "Delete User Permanently" action button for B2B Super Admins to permanently remove rejected B2B companies from the system.

### Updated
* UI Change: Applied the Super Admin dashboard dark theme aesthetics to the B2B Admin sidebar (`B2BSidebar.jsx`) to keep a unified design.
* API Update: Modified `PATCH /api/admin/b2b-users/:id/status` to throw an error if trying to change the status of a permanently rejected B2B user.
* UI Feature: Modified `ManageB2BUsers.jsx` to prevent "Re-approve" for rejected B2B users, enforcing permanent rejection logic.
* frontend/src/modules/UserApp/pages/Register.jsx
* frontend/src/shared/utils/api.js
* backend/src/modules/b2bUser/controllers/auth.controller.js
* backend/src/modules/b2bUser/controllers/profile.controller.js
* backend/src/modules/b2bUser/controllers/dashboard.controller.js
* backend/src/modules/b2bUser/controllers/employee.controller.js

### Deleted
* None

### Database Changes
* None

### Routes Changes
* None

### Frontend Changes
* Updated Forms: Reverted `Register.jsx` to correctly send `companyData` and `adminData` as nested objects instead of a flattened payload, properly matching the backend validation requirements.
* Updated Components: 
  * Modified `api.js` Axios interceptor to dynamically trigger Zustand store logouts (`useB2BAdminStore` and `useAuthStore`) on 401 errors, breaking the infinite redirect loop for expired sessions.
  * Fixed `B2BSidebar.jsx` to use `useB2BAdminStore` instead of `useAuthStore` for the Logout function, so B2B Admins actually log out correctly and are redirected to `/login` without looping.
  * Fixed `B2BHeader.jsx` to fetch and display the `adminProfile` data from `useB2BAdminStore` instead of the B2C user profile.
  * Fixed `b2bAdminStore.js` `logout()` to fully purge `b2bAdminRefreshToken` alongside the main token.

### Backend Changes
* Controllers Updated: 
  * `auth.controller.js`: Added `companyId` into the B2B Admin JWT token payload upon login.
  * `profile.controller.js`: Fixed Admin Profile lookups by correcting `req.user._id` to `req.user.id`. Refactored Company Profile endpoints to query the DB for `companyId` securely.
  * `dashboard.controller.js`: Added a DB lookup fallback to fetch `companyId` if the current user session/token is missing it.
  * `employee.controller.js`: Implemented `getCompanyId` helper to seamlessly fetch `companyId` via DB fallback for CRUD operations.

### Notes
* Fixed the core B2B registration failure caused by a payload structure mismatch.
* Fixed the infinite redirect loop where a user with an expired/invalid token was trapped on the `/b2b-dashboard/overview` page.
* Resolved empty Dashboard stats and broken Admin/Company Profile pages by properly linking `companyId` back to the active B2B Admin session.

## 2026-06-20

### Fixed
* **Direct RFQ PO Generation Failure**:
  - Modified `confirmQuote` in `backend/src/modules/b2bUser/controllers/rfq.controller.js` to pre-load company and vendor information before creating the dummy RFQ.
  - Provided the required `companyName`, `vendorName`, and `deliveryTime` validation fields to `RFQ.create` to satisfy Mongoose schema rules.
  - Linked `createdByEmployeeId` to `directRfq.employeeId` to preserve the employee source context on generated Purchase Orders.
  - Implemented an existence check for the dummy RFQ to prevent duplicate key/uniqueness database validation errors on `rfqId`.

### Updated
* **B2B Admin RFQs Sourcing Center Dashboard**:
  - Updated status filters in `frontend/src/modules/B2BAdmin/pages/RFQs.jsx` to correctly support Direct RFQ statuses (`Pending Admin Approval`, `Pending Vendor`, `Negotiating`, `Vendor Accepted`, `PO Generated`).
  - Unified filtering of generated Purchase Orders for both standard and direct RFQs (`Purchase Order Generated` and `PO Generated`).
  - Added color mapping rules in `getStatusVariant` for proper status badge variants.
  - Filtered out dummy RFQs (which start with `'DRFQ-'`) in standard listing fetches to prevent duplicates from showing up in `RFQs.jsx` and `RFQDiscussions.jsx`.
* **B2B Admin Employee Management on Consumer Profile Page**:
  - Modified `frontend/src/modules/UserApp/pages/Profile.jsx` to show the "Team Management" sidebar menu option to B2B Admins (`user?.role === 'b2bAdmin'`).
  - Allowed B2B Admins to edit company details on the "Company Profile" tab.
  - Linked the "Team Management" tab actions (Add, Edit, Delete, Toggle Status) and employee list data source to live backend database endpoints using `useB2BAdminStore` hooks, syncing changes to the backend.


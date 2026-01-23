# Project Tasks

## 🚀 In Progress

## 📋 Ready
<!-- User-approved tasks ready for execution. Prefix: R-### -->


## 🧊 Backlog
<!-- Ideas, future work, and underspecified tasks. Prefix: B-### -->

### 🏗️ Foundation & UI (Demonstrable Outputs)




- [ ] **B-018**: Enhanced Toast Notifications
  - [ ] Add toast confirmation on successful logout
  - [ ] Audit application for consistent user feedback (Success/Error/Warning)
  - [ ] Ensure API errors trigger appropriate error toasts
  - [ ] Ensure critical actions (save, delete, etc.) have success toasts

- [x] **B-017**: Add Admin Dashboard Link for Admin Users
  - [x] Display "Admin Dashboard" link in the global header or user menu
  - [x] Visible ONLY to users with `admin` role
  - [x] Ensure seamless navigation between public site and admin area

- [ ] **B-005**: Implement Admin User Management UI (Table: Admin/Editor/Viewer)
  - [ ] Admin can manage users (Add, Edit, Delete)
  - [ ] **Roles**: Admin (All permissions), Editor (Add/Edit/Delete data), Viewer (Read-only)
  - [ ] Admin can set passwords for all users
  - [ ] Editor can edit their own password

### ⚙️ Core Logic & Data


- [x] **B-006**: Implement Dynamic Data Table System (Customizable Entity Types)
  - [x] **Type Schema Management**:
    - [x] Create a "Schema" definition stored in DB (JSON format).
    - [x] Schema fields: `name`, `type` (text, number, boolean, options, date), `description`, `required`, `defaultValue`.
    - [x] Support for ordered vs. unordered data types.
  - [x] **Data Management**:
    - [x] Reusable `DataTable` component that renders based on a Type's schema.
    - [x] Admin interface with tabs for each defined Data Type.
    - [x] Full CRUD: Add, Edit, Delete, and Reorder (via arrows).
    - [x] Permission integration: Handle types that prevent specific actions (add/delete/edit/reorder).
  - [ ] **Low Priority Enhancement**: Drag-and-drop reordering (currently using arrow buttons)

- [/] **B-005**: Implement User Management & Registration System
  - [/] **User Registration Flow**:
    - [x] Add "Register" link to Login page and modal
    - [x] Create Registration page capturing: username, name, email, password
    - [x] New users start in "pending" status (inactive until admin approval)
    - [ ] Admin notification system for new user registrations
  - [x] **User Management UI** (using Dynamic Data Tables):
    - [x] Admin can view all users in a data table
    - [x] Admin can manage users: Edit, Delete, Approve/Activate
    - [x] **Roles**: Admin (All permissions), Editor (Add/Edit/Delete data), Viewer (Read-only)
    - [x] Admin can set/reset passwords for all users
  - [/] **Password Management**:
    - [x] Logged-in users can change their own password
    - [ ] Admin can change any user's password (for forgotten password recovery)
    - [ ] **Admin Password Reset Options** (minimal dependencies):
      - [ ] Research and document options for admin password reset without SMTP server
      - [ ] Consider: Manual DB edit to clear password (triggers reset flow)
      - [ ] Consider: File-based reset token system
      - [ ] Consider: Simple email service integration (e.g., SendGrid free tier, Resend)
      - [ ] Implement chosen solution with clear documentation


### 🎨 Metadata & Assets
- [ ] **B-011**: Implement Image Upload & Storage Strategy
  - [ ] Image upload functionality for Data images and Site Logo
  - [ ] Decision on storage strategy (local vs cloud)
- [ ] **B-012**: Standardize Base Styles & Variables
  - [ ] Define global variables for colors, spacing, typography (fonts, sizes), and borders
  - [ ] Configure standard border-radius and shadow tokens
  - [ ] Update existing components to use variables
  - [ ] Ensure dark mode compatibility




## 💡 Suggestions (AI-generated)
<!-- AI proposals for improvements. Prefix: S-### -->

## 🧾 Technical Debt
<!-- Recorded technical debt. Prefix: TD-### -->

- [ ] **TD-001**: Admin Self-Edit Protection
  - Admin can currently change their own role or suspend themselves in User Management UI
  - Needs conditional field disabling logic (check if editing user is current user)
  - May require enhancement to dynamic table system for conditional field disabling
  - Location: `client/src/pages/admin/AdminUsers.jsx`

- [ ] **TD-002**: Simplify User Management UI
  - Current: Separate "Pending Approval" and "All Users" tables
  - Proposed: Single unified table with all users
  - Approving should be an action button (not separate section)
  - When user is approved, replace "Approve" button with "Suspend" button
  - Benefits: Simpler UI, less code duplication, better UX
  - Location: `client/src/pages/admin/AdminUsers.jsx`

- [ ] **TD-003**: Redirect on Logout from Restricted Pages
  - Current: User stays on protected page after logout (until refresh/nav)
  - Required: Redirect to home or login page immediately upon logout if on a restricted route
  - Affects: Admin pages, User Profile page

## 💡 Suggestions (Norm Updates)
<!-- Proposed updates to NORMS.md. Prefix: S-NORM-### -->

## ✅ Done
<!-- Completed and verified tasks. Prefix: D-### -->

- [x] **D-016**: Implement Dedicated Login Page & Redirect Logic (B-014)
  - [x] Extracted shared `LoginForm` component for modal and page reuse
  - [x] Implemented full-page `LoginPage` with glassmorphism UI
  - [x] Updated `ProtectedRoute` to redirect to `/login` with `from` state
  - [x] Implemented automatic redirection to original destination after login
  - [x] Verified `LoginModal` functionality remains intact

- [x] **D-001**: Initialize Project Structure (React Frontend + Node.js Backend)
  - [x] React frontend project initialized (using **Vite**) in `/client`
  - [x] Node.js backend project initialized (using **Express**) in `/server`
  - [x] Root `package.json` set up to run both servers simultaneously
  - [x] Proxy configured for seamless frontend-backend communication

- [x] **D-008**: Implement Authentication Logic (Roles, Setup Flow, Redirects)
  - [x] Redirect to setup page if no admin exists (to create admin)
  - [x] Default role: Viewer (No login required)
  - [x] Login required for Editor and Admin roles
  - [x] Hook: `useAuth` (check login status, user role)
  - [x] Refactor all inline styles to CSS Modules
  - [x] Implement Premium Global Header & Footer

- [x] **D-009**: Develop Standard Data Hooks (Fetch, CRUD, Types)
  - [x] Created `apiClient` for standardized fetching
  - [x] Implemented `DataContext` with SWR (Stale-While-Revalidate) caching
  - [x] Developed generic `useData` and `useDataMutations` hooks
  - [x] Built specialized `useSiteMeta` hooks and backend integration

- [x] **D-010**: Implement Site Metadata UI (B-010)
  - [x] Transformed Settings placeholder into a functional form
  - [x] Integrated SWR hooks for live Header/Footer updates
  - [x] Implemented "dirty check" and success feedback logic

- [x] **D-015**: Implement Global Toast/Alert System (B-015)
  - [x] Created `ToastContext` with timer-safe state management
  - [x] Developed OKLCH-based relative color system for premium aesthetics
  - [x] Implemented 1:1 responsive swipe-to-dismiss gestures
  - [x] Added `ToastPlayground` for system verification

- [x] **D-002**: Implement Basic Home Page & Routing Structure
  - [x] Basic home page component
  - [x] Standard set of routes proposed and implemented

- [x] **D-003**: Create Login Modal Component (Global access)
  - [x] Modal component accessible from any page
  - [x] Supports Login and Logout functionality

- [x] **D-004**: Design Admin Dashboard & Global Layout
  - [x] Admin pages organized as tabs
  - [x] Layout customizable for future additional pages
  - [x] Implemented reusable TabNavigation with horizontal scrolling
  - [x] Implemented Premium Global Header & Footer with Glassmorphism

- [x] **D-013**: Implement Modern CSS Reset
  - [x] Added `reset.css` (User provided)
  - [x] Imported in `index.css` and cleaned up redundancies

- [x] **D-007**: Setup Simple NoSQL Database & Connection
  - [x] Installed `nedb-promises` (Embedded MongoDB-like DB)
  - [x] Configured `server/config/db.js` and `server/models/User.js`
  - [x] Connected in `server/index.js`

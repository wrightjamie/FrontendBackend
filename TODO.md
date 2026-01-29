# Project Tasks

## 🚀 In Progress
- [x] **D-026**: Update README.md (Architecture, Dynamic Data, Permissions) & Doc Norms (B-026)
  - [x] Establish "Documentation Update" mandate in `AGENT.md` and `NORMS.md`
  - [x] Complete overhaul of `README.md` to reflect project specifics

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




- [ ] **B-012**: Standardize Base Styles & Core Components
  - [ ] Define global design tokens (OKLCH colors, spacing, typography, shadows)
  - [ ] Create standardized component styles (Buttons, Input fields, Selects, Cards)
  - [ ] Standardize Table UI (header, rows, hover states, pagination layout)
  - [ ] Ensure full dark mode compatibility across all core components

- [ ] **B-023**: Implement SVG Icon System
  - [ ] Research and choose solution (pre-built vs self-built)
  - [ ] Implement caching for performance
  - [ ] Ensure ease of use across components


- [ ] **B-005**: Refine Admin User Management UI
  - [ ] Implement premium UI components (replace `window.confirm` and `prompt` with custom modals)
  - [ ] Consolidate "Pending Approval" and "All Users" into a single unified table (TD-002)
  - [ ] Add filtering/sorting for status and role
  - [x] Implement protection logic to prevent admins from de-activating themselves (TD-001)


### ⚙️ Core Logic & Data

- [ ] **B-024**: Implement Admin Password Management Flow
  - [ ] Admin can change any user's password (for forgotten password recovery)
  - [ ] **Admin Password Reset Options** (minimal dependencies):
    - [ ] Research and document options for admin password reset without SMTP server
    - [ ] Consider: Manual DB edit to clear password (triggers reset flow)
    - [ ] Consider: File-based reset token system
    - [ ] Consider: Simple email service integration (e.g., SendGrid free tier, Resend)
    - [ ] Implement chosen solution with clear documentation


### 🎨 Metadata & Assets
- [ ] **B-011**: Refine Admin Media Gallery
  - [x] View all uploaded images in a grid (with thumbnails)
  - [x] Delete images (files + DB records)
  - [x] Copy URL to clipboard
  - [x] Store image metadata (Title, ID) in Database
  - [x] Generate thumbnails on upload (using `sharp`)
  - [x] **D-022**: Regenerate Thumbnails feature (Admin button + Backend endpoint)
  - [ ] Allow multiple file uploads at once
  - [x] **B-021**: [Bug] Fix Site Logo persistence in Admin Settings
  - [x] **B-022**: [Feature] Reusable `ImageSelect` Popover component

- [ ] **B-025**: Multiple Image Sizes for Responsive Images
  - [ ] Extend `sharp` processing to generate multiple variants (e.g., sm, md, lg)
  - [ ] Standardize size definitions in `config/mediaConfig.js`
  - [ ] Implement frontend helper/component to utilize responsive image sets (`srcset`)

- [ ] **B-020**: Generic Frontend Pagination
  - [ ] Create reusable Pagination component
  - [ ] Integrate into `DataTable` component
  - [ ] Purely frontend-based (filter visible rows) for snappy UX




## 💡 Suggestions (AI-generated)
<!-- AI proposals for improvements. Prefix: S-### -->

## 🧾 Technical Debt
<!-- Recorded technical debt. Prefix: TD-### -->

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

- [x] **D-017**: Add Admin Dashboard Link for Admin Users (B-017)
  - [x] Display "Admin Dashboard" link in the global header or user menu
  - [x] Visible ONLY to users with `admin` role
  - [x] Ensure seamless navigation between public site and admin area

- [x] **D-027**: Admin Self-Edit Protection (TD-001)
  - [x] Prevent admins from changing their own role or status in UI/Backend
  - [x] Disable delete button for self in User Management UI
  - [x] Added `:disabled` styles and tooltips for better UX

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

- [ ] **B-019**: Create Dependencies Documentation
  - [ ] Create `DEPENDENCIES.md` file
  - [ ] List all backend and frontend dependencies
  - [ ] Explain purpose and justification for each choice

- [x] **D-006**: Implement Dynamic Data Table System (Customizable Entity Types) (B-006)
  - [x] **Type Schema Management**:
    - [x] Create a "Schema" definition stored in DB (JSON format).
    - [x] Schema fields: `name`, `type` (text, number, boolean, options, date), `description`, `required`, `defaultValue`.
    - [x] Support for ordered vs. unordered data types.
  - [x] **Data Management**:
    - [x] Reusable `DataTable` component that renders based on a Type's schema.
    - [x] Admin interface with tabs for each defined Data Type.
    - [x] Full CRUD: Add, Edit, Delete, and Reorder (via arrows).
    - [x] Permission integration: Handle types that prevent specific actions (add/delete/edit/reorder).

## ❄️ Frozen
<!-- Tasks on hold or low priority. -->

- [ ] **B-006 (Old)**: Drag-and-drop reordering for Data Tables
  - Note: Currently using arrow buttons, which is sufficient for current needs.

# Project Tasks

## 🚀 Active
- [ ] *No active task selected. Ready for next phase.*

## 📋 Priority Backlog
<!-- Immediate next steps or user-highlighted features -->
- [x] **B-031**: Enforce Best Practices (Strict Mode & A11y)
  - [x] Enable React Strict Mode
  - [x] Add `eslint-plugin-jsx-a11y` and fix reported issues

## 🧊 Backlog

### 🏗️ Foundation & UI
- [x] **B-018**: Enhanced Toast Notifications
  - [x] Add toast confirmation on successful logout
  - [x] Audit application for consistent user feedback (Success/Error/Warning)
  - [x] Ensure API errors trigger appropriate error toasts
### ⚙️ Core Logic & Data
- [x] **B-024**: Implement Admin Password Management Flow
  - [x] Admin can change any user's password (for recovery)
  - [x] Implement secure reset flow without external SMTP (Force Change on login)
  - [x] Added Emergency Admin Reset CLI script
- [ ] **B-043**: Various bug fixes
  - [x] No user hook test
  - [x] ImageUpload component - padding around text
  - [x] Footer - pull text from the admin console. Add appropriate setting
  - [x] Footer - allow setting links (replicate menu system)
  - [x] Button - small and medium sizes are the same
  - [x] Button - grouped - show middle button in storybook (group of 3, not just 2)
  - [x] Pagination - when there's only a small number of pages, we can start to hide the skip buttons (end, next, first, prev)
  - [x] Popover storybook - doesn't actually show anything (do we need a button to press?)
  - [x] ResponsiveImage - storybook - nothing shown. Do we need a default image to show?
  - [x] Storybook Table - no data. Do we need a default table to show?
  - [x] Toast - warning - colours are wrong - it is all white.
  - [x] Toast - doesn't show in front of the header
  - [x] RadioGroup - storybook - nothing shown. Do we need a default radio group to show?




### 🎨 Metadata & Assets
- [x] **B-011**: Multi-file Uploads
  - [x] Update server endpoint to accept `upload.array`
  - [x] Update `FileUpload` component for drag-and-drop array support
  - [x] Update frontend hooks to send FormData with multiple files
- [ ] **B-042**: Image Cropping/Editing Preview
  - [ ] Implement image cropping/editing preview

## 🧾 Technical Debt
- [x] **TD-003**: Fix Logout Redirection Logic
  - Currently redirected to Login page on logout instead of Home.
  - Potential race condition in `AuthContext`.
- [x] **TD-004**: Replace prompt/confirm with custom modals
  - Admin actions currently use native browser dialogs.


## 💡 Suggestions (AI-generated)
<!-- AI proposals for improvements. Prefix: S-### -->
- [ ] **S-001**: Implement Role-based Sidebar navigation (instead of just Tabs)

## ✅ Done

### 🛠️ Phase 16: Technical Documentation (B-019)
- [x] **D-048**: Comprehensive Architecture Resource (B-019)
  - [x] Created `ARCHITECTURE.md` with dependency inventory and Mermaid diagrams.
  - [x] Documented all API endpoints and role-based access rules.
  - [x] Updated `README.md` for better onboarding.

### 🛠️ Phase 15: Admin Password Management (B-024)
- [x] **D-047**: Secure Admin Reset Flow (B-024)
  - [x] Implemented `mustResetPassword` enforcement.
  - [x] Created `ForcePasswordChange` redirection and UI.
  - [x] Built `reset_admin.js` emergency CLI utility.
  - [x] Consolidated Admin security policies.

### 🛠️ Phase 14: Enhanced User Feedback & API Error Audit
- [x] **D-046**: Enhanced User Feedback (B-018)
  - [x] Replaced all native `alert()` calls with `addToast` system in Admin area.
  - [x] Added success notifications for Create, Update, Delete, and Reorder actions.
  - [x] Standardized error toast messages across the application.
  - [x] Fixed accessibility and logic errors in Admin components.

### 🛠️ Phase 13: UI Refinement & Footer Customization
- [x] **D-045**: Custom Modal Dialogs (TD-004)
  - [x] Created `ModalContext` and `useModal` hooks for promise-based dialogs.
  - [x] Built native HTML `<dialog>` base component with CSS animations.
  - [x] Replaced native `window.confirm` and `prompt` usages globally.
- [x] **D-044**: UI Bug Fixes & Storybook Improvements (B-043)
  - [x] Fixed Button sizes and grouped styling.
  - [x] Added Toast warning/info colors and fixed z-index.
  - [x] Added conditional skip buttons to Pagination.
  - [x] Fixed Storybook stories for Table, Popover, ResponsiveImage, and RadioGroup.
  - [x] Added automated tests for the useUsers hook.
- [x] **D-043**: Dynamic Footer Settings (B-043)
  - [x] Implemented Admin UI for footer text and links.
  - [x] Updated SiteMeta and Footer to use dynamic settings.

### 🛠️ Phase 12: Maintenance & Operations
- [x] **D-042**: Added Missing Storybook Components (T-044)
  - [x] Added stories for `Pagination`, `Popover`, `ResponsiveImage`, `Table`, `Checkbox`, `Radio`, `RadioGroup`, `FileUpload`, and `Toast`.
- [x] **D-041**: Standardized Typography Tokens (T-043)
  - [x] Replaced hardcoded `font-size` values with `var(--text-*)`
  - [x] Replaced hardcoded `font-weight` values with `var(--font-*)`
- [x] **D-040**: Refined TabNavigation Visual Cues (B-041)
  - [x] Improved contrast for active, hover, and inactive states.
  - [x] Enhanced `AdminLayout.jsx` experience with thicker borders and color shifts.
- [x] **D-039**: Implement Component Explorer (Storybook) (B-029)
  - [x] Installed and configured Storybook
  - [x] Created stories for standard UI components building a component explorer
  - [x] Updated root and client build scripts

- [x] **D-036**: Maintenance Mode (S-002)
  - [x] Implemented server-side `maintenanceMiddleware`
  - [x] Added `maintenanceMode` and `maintenanceMessage` to `SiteMeta`
  - [x] Created `MaintenancePage` UI with automatic redirection
  - [x] Implemented bypass for admins and essential API/upload paths
- [x] **D-037**: Multiple Image Sizes for Responsive Images (B-025)
  - [x] Configured backend image processing sizes (sm, md, lg)
  - [x] Updated upload route to generate and store optimized variants
  - [x] Exposed media configuration via `SiteMeta` API
  - [x] Created reusable `ResponsiveImage` component with dynamic `srcset`
  - [x] Implemented fully documented unit tests and fixed regressions
- [x] **D-035**: 100% Component Test Coverage (B-028)
  - [x] Set up Vitest and React Testing Library
  - [x] Configured test scripts in `package.json`
  - [x] Created unit tests for all 24 UI components
  - [x] Achieved 100% pass rate with robust mocking and timer handling
- [x] **D-038**: 100% Server-Side Test Coverage
  - [x] Added Jest & Supertest infrastructure
  - [x] Implemented tests for Auth, Users, Data, Site, and Upload routes
  - [x] Configured in-memory DB for test isolation

### 🛠️ Phase 10: Pagination & Large Datasets
- [x] **D-034**: Generic Frontend & Backend Pagination (B-020)
  - [x] Implemented `findPaginated` in `DataEntity` model
  - [x] Added `page` and `limit` support to entities API
  - [x] Created reusable `Pagination` UI component
  - [x] Integrated pagination into `DynamicDataTable`

### 🛠️ Phase 5-6: Component Standardization & User Refinement
- [x] **D-029**: Standardize Base Styles & Core Components (B-012)
  - [x] Defined global design tokens (OKLCH)
  - [x] Created `Input`, `Select`, `FileUpload`, `Checkbox`, `Radio`
  - [x] Consolidated form components to `components/ui/form`
  - [x] Created generic `CenteredLayout`
- [x] **D-030**: Refine Admin User Management UI (B-005 / TD-002)
  - [x] Consolidated "Pending" and "All Users" into one table
  - [x] Added status/role filtering (Pills)
  - [x] Implemented Admin self-edit protection
- [x] **D-031**: Media Gallery Enhancements (B-011)
  - [x] Image grid, metadata storage, and thumbnail generation
  - [x] Reusable `ImageSelect` Popover

- [x] **D-032**: Implement SVG Icon System (B-023)
  - [x] Integrated `lucide-react` library
  - [x] Replaced generic text/unicode with premium icons
  - [x] Standardized usage across Admin, Forms, and Toasts
  - [x] Transitioned Admin Media Library to full SVG icons

- [x] **D-033**: Refine Login Page Layout
  - [x] Stacked header and subtext vertically
  - [x] Left-aligned content per user preference
  - [x] Cleaned up CardHeader styling for login context

### 🏗️ Phase 1-4: Foundation & Infrastructure
- [x] **D-028**: Logout Success Feedback (B-018)
- [x] **D-026**: Documentation Overhaul (README, AGENT, NORMS)
- [x] **D-016**: Dedicated Login Page & Redirects
- [x] **D-015**: Premium Toast/Alert System
- [x] **D-006**: Dynamic Data Table System (Custom Schemas)
- [x] **D-001**: Project Init (Vite + Node/Express)
- [x] **D-008**: Auth Logic (Roles, Setup Flow)
- [x] **D-009/010**: API Client & Site Metadata UI

## ❄️ Frozen
- [ ] **B-006 (Old)**: Drag-and-drop reordering for Data Tables
- [ ] **B-030**: Improve Data Fetching Strategy (TanStack Query)
- [x] **B-019**: Create Dependencies Documentation
  - [x] Detailed dependency inventory for client and server
  - [x] Mermaid diagrams for Auth, Data, and Media flows
  - [x] API Route Registry with role-based permission mapping

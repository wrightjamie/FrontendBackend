# Project Tasks

## 🚀 Active
- [ ] *No active task selected. Ready for next phase.*

## 📋 Priority Backlog
<!-- Immediate next steps or user-highlighted features -->
- [ ] **B-041**: Refine `TabNavigation.jsx` visual cues
  - Improve contrast for active, hover, and inactive states.
  - Specifically focus on the usage in `AdminLayout.jsx`.
  - Ensure strong visual distinction (e.g., thicker borders, color shifts).
- [ ] **B-028**: Implement Testing Infrastructure
  - [ ] Set up Vitest and React Testing Library
  - [ ] Configure test scripts in `package.json`
  - [ ] Write initial tests for core UI components (`Button`, `Input`)
- [ ] **B-029**: Implement Component Explorer (Storybook)
  - [ ] Install and configure Storybook
  - [ ] Create stories for standard UI components (`components/ui`)
  - [ ] Document usage guidelines
- [ ] **B-031**: Enforce Best Practices (Strict Mode & A11y)
  - [ ] Enable React Strict Mode
  - [ ] Add `eslint-plugin-jsx-a11y` and fix reported issues

## 🧊 Backlog

### 🏗️ Foundation & UI
- [ ] **B-018**: Enhanced Toast Notifications
  - [x] Add toast confirmation on successful logout
  - [ ] Audit application for consistent user feedback (Success/Error/Warning)
  - [ ] Ensure API errors trigger appropriate error toasts
### ⚙️ Core Logic & Data
- [ ] **B-024**: Implement Admin Password Management Flow
  - [ ] Admin can change any user's password (for recovery)
  - [ ] Implement secure reset flow without external STMP if possible
- [ ] **B-025**: Multiple Image Sizes for Responsive Images
  - [ ] Extend `sharp` processing to generate variants (sm, md, lg)
  - [ ] Implement frontend `srcset` support

### 🎨 Metadata & Assets
- [ ] **B-011 (Part 2)**: Advanced Media Features
  - [ ] Allow multiple file uploads at once
  - [ ] Implement image cropping/editing preview

## 🧾 Technical Debt
- [ ] **TD-003**: Fix Logout Redirection Logic
  - Currently redirected to Login page on logout instead of Home.
  - Potential race condition in `AuthContext`.
- [ ] **TD-004**: Replace prompt/confirm with custom modals
  - Admin actions currently use native browser dialogs.

## 💡 Suggestions (AI-generated)
<!-- AI proposals for improvements. Prefix: S-### -->
- [ ] **S-001**: Implement Role-based Sidebar navigation (instead of just Tabs)
- [ ] **S-002**: Add "Maintenance Mode" toggle in Admin Settings

## ✅ Done

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
- [ ] **B-019**: Create Dependencies Documentation

# Project Tasks

## 🚀 In Progress

## 📋 Ready
<!-- User-approved tasks ready for execution. Prefix: R-### -->


## 🧊 Backlog
<!-- Ideas, future work, and underspecified tasks. Prefix: B-### -->

### 🏗️ Foundation & UI (Demonstrable Outputs)




- [ ] **B-005**: Implement Admin User Management UI (Table: Admin/Editor/Viewer)
  - [ ] Admin can manage users (Add, Edit, Delete)
  - [ ] **Roles**: Admin (All permissions), Editor (Add/Edit/Delete data), Viewer (Read-only)
  - [ ] Admin can set passwords for all users
  - [ ] Editor can edit their own password

### ⚙️ Core Logic & Data
- [ ] **B-006**: Implement Dynamic Data Table UI (Customizable Fields)
  - [ ] "Data" entities with configurable types (Rank, Name, Brand, etc.)
  - [ ] Standardized fields per type (Text, Image, Boolean)
  - [ ] Admin table display with reordering of types
  - [ ] Ability to Add, Edit, Delete, and Reorder data


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

## 💡 Suggestions (Norm Updates)
<!-- Proposed updates to NORMS.md. Prefix: S-NORM-### -->

## ✅ Done
<!-- Completed and verified tasks. Prefix: D-### -->

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

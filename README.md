# Agentic Frontend & Backend System

A robust, modular full-stack application designed for rapid development and AI-assisted engineering. This system features a dynamic content management engine, integrated media handling, and a sophisticated permission model.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository.
2. Install dependencies for the root, client, and server:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```
3. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   SESSION_SECRET=your_super_secret_key
   ```
4. Start the development environment (concurrently):
   ```bash
   npm start
   ```

### First-Run Setup
The system includes an automatic setup flow. If no users exist, navigating to the application will redirect you to `/setup` to create the initial **Administrator** account.

---

## 🏗️ Architecture

### Frontend (Client)
- **Framework**: React (built with Vite)
- **State & Data**:
  - **SWR**: Used for efficient data fetching, caching, and optimistic UI updates via custom hooks (`useData`, `useSiteMeta`).
  - **Context API**: Handles global state for Authentication and the Toast notification system.
- **Styling**: Vanilla CSS with **CSS Modules** for component-level scoping and global design tokens.
- **UI Components**: Premium, accessible components including glassmorphism headers, responsive tabs, and swipe-to-dismiss toasts.

### Backend (Server)
- **Framework**: Node.js with Express
- **Database**: `nedb-promises` (an embedded, MongoDB-compatible datastore) for simplicity and zero-configuration setups.
- **Auth**: Session-based authentication with `express-session` and `bcryptjs` for password hashing.
- **File Handling**: Integrated media management with `multer` for uploads and `sharp` for automatic thumbnail generation.

---

## ⚙️ Dynamic Data System

The "Content Management" core of the platform. Administrators can define custom **Data Types** (Schemas) that automatically generate management interfaces.

- **Types (Schemas)**: Define the structure (fields like text, number, boolean, date) and permissions (Can Add, Can Edit, Can Delete, Is Ordered).
- **Entities (Records)**: The actual content instances associated with a Type.
- **DataTable**: A reusable, schema-aware component that renders CRUD operations and supports arrow-button reordering for "Ordered" types.

---

## 🛡️ Authentication & Roles

| Role | Permissions |
| :--- | :--- |
| **Viewer** | Public read-only access (default for unauthenticated users). |
| **Editor** | Can manage data entities, content types, and media. |
| **Admin** | Full system control, including user management and site metadata. |

### Security Features
- **Protected Routes**: Frontend routes are guarded by the `ProtectedRoute` component.
- **Automatic Logout Redirection**: Users are automatically redirected to the home page if they logout while on a protected route.
- **Admin Self-Protection**: Logic prevents administrators from accidentally demoting or deleting their own accounts.
- **Backend Validation**: Authorization middleware (`isAdmin`, `isEditorOrAdmin`) enforces RBAC on all API endpoints.

---

## 🎨 Media Management

- **Upload Pipeline**: Supports image uploads with automatic metadata storage in the DB.
- **Variants**: Generates high-quality thumbnails automatically using the `sharp` library.
- **Admin Gallery**: A dedicated view to manage assets, copy URLs, and regenerate thumbnails.

---

## 📝 Operational Norms

### Documentation Mandate
As established in `AGENT.md` and `NORMS.md`:
- **Every task** must include an update to `README.md` and relevant documentation if project behavior or architecture changes.
- Documentation currency is a primary metric of task completion.

### Task Workflow
Tasks are tracked in `TODO.md` using a stable ID system:
- `B-###`: Backlog / Ready
- `T-###`: In Progress
- `D-###`: Done
- `TD-###`: Technical Debt
- `S-NORM-###`: Norm Suggestions
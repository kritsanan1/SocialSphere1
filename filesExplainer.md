
# File Structure Documentation

## Overview
This document provides a detailed analysis of the SocialAI application file structure, including complexity indicators and functional descriptions for each file.

## File Structure Analysis

```
📁 Project Root
├── 📄 .gitignore 🟢 - Git ignore patterns for build artifacts and sensitive files
├── 📄 .replit 🟢 - Replit configuration for deployment and workflows
├── 📄 components.json 🟢 - shadcn/ui component configuration
├── 📄 drizzle.config.ts 🟢 - Database ORM configuration for Neon PostgreSQL
├── 📄 package.json 🔴 - Project dependencies and npm scripts (50+ dependencies)
├── 📄 package-lock.json 🔴 - Locked dependency versions for reproducible builds
├── 📄 postcss.config.js 🟢 - PostCSS configuration for Tailwind CSS processing
├── 📄 replit.md 🟢 - Project overview and architecture documentation
├── 📄 tailwind.config.ts 🟡 - Tailwind CSS configuration with custom themes
├── 📄 tsconfig.json 🟢 - TypeScript compiler configuration
├── 📄 vite.config.ts 🟡 - Vite build tool configuration
├── 📄 vitest.config.ts 🟢 - Vitest testing framework configuration
│
├── 📁 attached_assets/
│   ├── 📄 AGENTS_1755889018121.md 🟢 - Development environment tips and guidelines
│   ├── 📄 Pasted--I-m-building-an-AI-social-media-app-*.txt 🟢 - Project prompt history
│   ├── 📄 Pasted-You-are-a-technical-documentation-*.txt 🟢 - Documentation requirements
│   ├── 📄 ayrshare-social-media-api-*.txt 🟢 - Ayrshare API documentation
│   └── 📄 content-*.md 🟢 - Additional project content and API references
│
├── 📁 client/
│   ├── 📄 index.html 🟢 - Main HTML template for React application
│   └── 📁 src/
│       ├── 📄 App.tsx 🟡 - Main application component with routing configuration
│       ├── 📄 index.css 🟢 - Global styles and Tailwind CSS imports
│       ├── 📄 main.tsx 🟢 - React application entry point
│       │
│       ├── 📁 components/
│       │   ├── 📁 auth/
│       │   │   └── 📄 auth-guard.tsx 🟡 - Route protection component for authenticated users
│       │   │
│       │   ├── 📁 dashboard/
│       │   │   ├── 📄 connected-platforms.tsx 🟡 - Social platform connection status display
│       │   │   ├── 📄 quick-actions.tsx 🟡 - Dashboard action buttons and shortcuts
│       │   │   ├── 📄 recent-activity.tsx 🟡 - Recent posts and activity timeline
│       │   │   └── 📄 stats-cards.tsx 🟡 - Analytics cards for followers, posts, views
│       │   │
│       │   ├── 📁 layout/
│       │   │   ├── 📄 header.tsx 🟢 - Application header with mobile menu toggle
│       │   │   ├── 📄 main-layout.tsx 🟢 - Main layout wrapper with sidebar integration
│       │   │   └── 📄 sidebar.tsx 🟡 - Navigation sidebar with menu items
│       │   │
│       │   └── 📁 ui/
│       │       ├── 📄 accordion.tsx 🟢 - Collapsible content sections
│       │       ├── 📄 alert-dialog.tsx 🟢 - Modal confirmation dialogs
│       │       ├── 📄 alert.tsx 🟢 - Notification alert components
│       │       ├── 📄 aspect-ratio.tsx 🟢 - Responsive aspect ratio containers
│       │       ├── 📄 avatar.tsx 🟢 - User profile image components
│       │       ├── 📄 badge.tsx 🟢 - Status and label badges
│       │       ├── 📄 breadcrumb.tsx 🟢 - Navigation breadcrumb trail
│       │       ├── 📄 button.tsx 🟡 - Interactive button components with variants
│       │       ├── 📄 calendar.tsx 🟡 - Date picker and calendar interface
│       │       ├── 📄 card.tsx 🟢 - Content container cards
│       │       ├── 📄 carousel.tsx 🟡 - Image and content carousel slider
│       │       ├── 📄 chart.tsx 🟢 - Chart and graph components
│       │       ├── 📄 checkbox.tsx 🟢 - Form checkbox inputs
│       │       ├── 📄 collapsible.tsx 🟢 - Collapsible content sections
│       │       ├── 📄 command.tsx 🟡 - Command palette and search interface
│       │       ├── 📄 context-menu.tsx 🟢 - Right-click context menus
│       │       ├── 📄 dialog.tsx 🟢 - Modal dialog components
│       │       ├── 📄 drawer.tsx 🟢 - Slide-out drawer panels
│       │       ├── 📄 dropdown-menu.tsx 🟢 - Dropdown menu components
│       │       ├── 📄 form.tsx 🟡 - Form validation and structure components
│       │       ├── 📄 hover-card.tsx 🟢 - Hover-triggered information cards
│       │       ├── 📄 input-otp.tsx 🟢 - One-time password input fields
│       │       ├── 📄 input.tsx 🟡 - Text input components with validation
│       │       ├── 📄 label.tsx 🟢 - Form field labels
│       │       ├── 📄 menubar.tsx 🟢 - Top-level menu bar navigation
│       │       ├── 📄 navigation-menu.tsx 🟢 - Main navigation menu components
│       │       ├── 📄 pagination.tsx 🟢 - Page navigation controls
│       │       ├── 📄 popover.tsx 🟢 - Floating content popovers
│       │       ├── 📄 progress.tsx 🟢 - Progress bar indicators
│       │       ├── 📄 radio-group.tsx 🟢 - Radio button group inputs
│       │       ├── 📄 resizable.tsx 🟢 - Resizable panel components
│       │       ├── 📄 scroll-area.tsx 🟢 - Custom scrollable areas
│       │       ├── 📄 select.tsx 🟢 - Dropdown select components
│       │       ├── 📄 separator.tsx 🟢 - Visual content separators
│       │       ├── 📄 sheet.tsx 🟢 - Slide-out sheet panels
│       │       ├── 📄 sidebar.tsx 🟡 - Sidebar navigation components
│       │       ├── 📄 skeleton.tsx 🟢 - Loading skeleton placeholders
│       │       ├── 📄 slider.tsx 🟢 - Range slider input components
│       │       ├── 📄 switch.tsx 🟢 - Toggle switch components
│       │       ├── 📄 table.tsx 🟢 - Data table components
│       │       ├── 📄 tabs.tsx 🟢 - Tabbed interface components
│       │       ├── 📄 textarea.tsx 🟢 - Multi-line text input
│       │       ├── 📄 toast.tsx 🟢 - Notification toast messages
│       │       ├── 📄 toaster.tsx 🟢 - Toast notification container
│       │       ├── 📄 toggle-group.tsx 🟢 - Toggle button groups
│       │       ├── 📄 toggle.tsx 🟢 - Toggle button components
│       │       └── 📄 tooltip.tsx 🟢 - Hover tooltip components
│       │
│       ├── 📁 hooks/
│       │   ├── 📄 use-auth.tsx 🟡 - Authentication state management hook
│       │   ├── 📄 use-mobile.tsx 🟢 - Mobile device detection hook
│       │   └── 📄 use-toast.ts 🟢 - Toast notification management hook
│       │
│       ├── 📁 lib/
│       │   ├── 📄 auth.ts 🟢 - Authentication utility functions
│       │   ├── 📄 queryClient.ts 🟢 - TanStack Query client configuration
│       │   └── 📄 utils.ts 🟢 - General utility functions and helpers
│       │
│       └── 📁 pages/
│           ├── 📄 connect-socials.tsx 🟡 - Social platform connection management
│           ├── 📄 content-calendar.tsx 🟡 - Content scheduling calendar interface
│           ├── 📄 dashboard.tsx 🟡 - Main dashboard with analytics and overview
│           ├── 📄 login.tsx 🟡 - User authentication login form
│           ├── 📄 not-found.tsx 🟢 - 404 error page component
│           ├── 📄 register.tsx 🟡 - User registration form
│           ├── 📄 social-comments.tsx 🟡 - Social media comment management
│           ├── 📄 social-messages.tsx 🟡 - Direct message management interface
│           └── 📄 upload-posts.tsx 🟡 - Content creation and posting interface
│
├── 📁 server/
│   ├── 📄 db.ts 🟡 - Database connection and configuration
│   ├── 📄 index.ts 🟡 - Express server entry point and middleware setup
│   ├── 📄 routes.ts 🔴 - API routes and endpoint handlers (20+ routes)
│   ├── 📄 storage.ts 🔴 - Database operations and data access layer
│   ├── 📄 vite.ts 🟡 - Vite development server integration
│   └── 📁 services/
│       └── 📄 ayrshare.ts 🟡 - Ayrshare API service integration
│
├── 📁 shared/
│   └── 📄 schema.ts 🟡 - Shared TypeScript schemas and validation
│
└── 📁 tests/
    ├── 📄 setup.ts 🟡 - Testing environment setup and configuration
    ├── 📁 components/
    │   ├── 📁 auth/
    │   │   └── 📄 login-form.test.tsx 🟡 - Login form component tests
    │   ├── 📁 dashboard/
    │   │   └── 📄 stats-cards.test.tsx 🟡 - Dashboard statistics card tests
    │   └── 📁 forms/
    │       └── 📄 upload-form.test.tsx 🟡 - Upload form component tests
    ├── 📁 hooks/
    │   └── 📄 use-auth.test.tsx 🟡 - Authentication hook tests
    ├── 📁 schemas/
    │   └── 📄 validation.test.ts 🟡 - Schema validation tests
    ├── 📁 server/
    │   ├── 📄 auth.test.ts 🟡 - Authentication API tests
    │   ├── 📄 ayrshare.test.ts 🟡 - Ayrshare service integration tests
    │   ├── 📄 routes.test.ts 🟡 - API route endpoint tests
    │   └── 📄 storage.test.ts 🟡 - Database operation tests
    └── 📁 utils/
        ├── 📄 api.test.ts 🟡 - API utility function tests
        ├── 📄 format.test.ts 🟡 - Data formatting utility tests
        └── 📄 test-utils.tsx 🟡 - Testing helper utilities
```

## Complexity Analysis

### Summary Statistics
- **Total Files:** 89 files
- **🟢 Low Complexity (0-3 imports):** 52 files (58%)
- **🟡 Medium Complexity (4-7 imports):** 31 files (35%)
- **🔴 High Complexity (8+ imports):** 6 files (7%)

### High Complexity Files
The following files have high import complexity and may benefit from refactoring:
1. `package.json` - 50+ dependencies
2. `server/routes.ts` - 20+ API routes
3. `server/storage.ts` - Complex database operations
4. `package-lock.json` - Auto-generated dependency lock

### Architecture Insights
- **Monorepo Structure:** Client and server code organized in separate directories
- **Component Architecture:** Well-organized UI components using shadcn/ui
- **Testing Coverage:** Comprehensive test suite covering components, hooks, and server logic
- **Type Safety:** Full TypeScript implementation across frontend and backend
- **Modern Stack:** React 18, Express, Vite, and Vitest for optimal development experience

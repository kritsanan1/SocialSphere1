# AI Development Rules for SocialAI

This document outlines the technical stack and specific library usage rules for the SocialAI application. Adhering to these guidelines is crucial for maintaining code consistency, quality, and maintainability.

## Core Tech Stack

The application is built on a modern, type-safe stack. Here are the key technologies:

-   **Frontend**: React with TypeScript, built and served with Vite for a fast development experience.
-   **Backend**: A Node.js server using the Express.js framework, also written in TypeScript.
-   **Database**: Serverless PostgreSQL hosted on Neon, with Drizzle ORM providing a type-safe query layer.
-   **UI Components**: A comprehensive component library built with shadcn/ui on top of Radix UI primitives.
-   **Styling**: Tailwind CSS is used exclusively for styling, following a utility-first approach.
-   **Server State Management**: TanStack Query handles all data fetching, caching, and server state synchronization.
-   **Routing**: Wouter provides lightweight, hook-based routing for the client-side application.
-   **Forms & Validation**: React Hook Form is used for building performant forms, with Zod for robust schema-based validation.
-   **Authentication**: A custom JWT (JSON Web Token) based authentication system is implemented on the backend.

## Library Usage Rules

To ensure consistency, please follow these specific rules for implementing new features.

### 1. UI and Components
-   **ALWAYS** use components from the `shadcn/ui` library (`@/components/ui/*`).
-   If a required component does not exist, create a new one following the structure and style of existing shadcn/ui components.
-   **DO NOT** introduce other UI libraries like Material UI, Ant Design, or Bootstrap.

### 2. Styling
-   **ONLY** use Tailwind CSS utility classes for styling.
-   Avoid writing custom CSS in `.css` files unless absolutely necessary for a global style or complex animation.
-   **DO NOT** use CSS-in-JS libraries like Emotion or Styled-components.

### 3. State Management
-   For **server state** (data fetched from the API), **ALWAYS** use `TanStack Query` (`useQuery`, `useMutation`).
-   For **global client-side state** (e.g., authentication status, theme), use React Context and custom hooks (like `useAuth`).
-   **DO NOT** introduce other state management libraries like Redux, Zustand, or MobX.

### 4. Routing
-   All client-side routing **MUST** be handled by `Wouter`.
-   Define all application routes within `client/src/App.tsx`.

### 5. Forms
-   For all forms, **MUST** use `React Hook Form` for logic and state management.
-   Validation **MUST** be handled by `Zod`. If a schema is shared between the client and server, define it in the `shared/schema.ts` file.

### 6. Icons
-   **ONLY** use icons from the `lucide-react` package to maintain visual consistency.

### 7. API Requests
-   When fetching data within components, use the `useQuery` hook from TanStack Query.
-   For mutations (POST, PUT, DELETE), use the `useMutation` hook and the `apiRequest` helper function from `@/lib/queryClient`.

### 8. Database Interactions
-   All backend database operations **MUST** go through the Drizzle ORM client defined in `server/db.ts`.
-   Use the data access layer in `server/storage.ts` to interact with the database. **DO NOT** write database queries directly in API route handlers.
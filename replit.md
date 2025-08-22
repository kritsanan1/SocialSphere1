# replit.md

## Overview

SocialAI is a comprehensive AI-powered social media management platform built with React, Express, and PostgreSQL. The application allows users to manage multiple social media accounts across platforms like Twitter, Facebook, Instagram, and LinkedIn through a unified dashboard. It integrates with the Ayrshare API to provide posting, scheduling, analytics, and engagement features across all connected platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark theme support
- **State Management**: TanStack Query for server state and React Context for auth state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Uploads**: Multer middleware for handling media uploads
- **API Structure**: RESTful API design with middleware for authentication and logging

### Data Storage
- **Primary Database**: PostgreSQL hosted on Neon
- **Database Schema**: 
  - Users table with authentication and Ayrshare API key storage
  - Social profiles table for connected platform accounts
  - Posts table for content management and scheduling
  - Social messages and comments tables for engagement tracking
  - Analytics tables for performance metrics
- **Connection**: Neon serverless driver with WebSocket support for real-time features

### Authentication & Authorization
- **Authentication Method**: JWT tokens stored in localStorage
- **Password Security**: bcrypt hashing with salt rounds
- **Route Protection**: Auth guards on frontend routes and middleware verification on API endpoints
- **User Context**: React Context provider for global auth state management

## External Dependencies

### Third-Party APIs
- **Ayrshare API**: Primary integration for social media operations
  - Social profile creation and management
  - Multi-platform content posting and scheduling
  - Analytics and engagement data retrieval
  - Direct message and comment management
  - Supports 13+ social platforms including Twitter, Facebook, Instagram, LinkedIn

### Database & Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL database with automatic scaling
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **React Query**: Server state management with caching and background updates
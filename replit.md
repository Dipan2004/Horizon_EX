# Horizon - AI Interview Assistant

## Overview

Horizon is an AI-powered interview preparation platform that helps users practice and improve their interviewing skills. The application allows users to upload resumes, analyze their qualifications, conduct mock interviews, and receive real-time assistance during interview sessions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Radix UI components with shadcn/ui design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Neon (serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **File Processing**: Multer for handling resume uploads
- **AI Integration**: Multiple providers (OpenAI, Anthropic, Google Gemini, Hugging Face)

## Key Components

### Resume Management
- **Upload & Processing**: PDF/text resume upload with content extraction
- **Analysis**: AI-powered skill extraction and experience summarization
- **Storage**: Resumes stored in PostgreSQL with structured data (skills, experience, achievements)

### AI Service Layer
- **Multi-Provider Support**: Abstracted AI service supporting multiple providers
- **Core Functions**:
  - Resume analysis and skill extraction
  - Company research and insights
  - Interview question generation
  - Response evaluation and feedback
  - Real-time conversation assistance

### Interview System
- **Mock Interviews**: Structured interview sessions with AI-generated questions
- **Real-time Assistant**: Live conversation support with speech recognition
- **Feedback Engine**: Scoring and improvement suggestions
- **Session Management**: Interview history and progress tracking

### Database Schema
- **Resumes Table**: User resumes with extracted skills and experience
- **Interviews Table**: Q&A sessions with scores and feedback
- **Extensible Design**: Ready for additional tables (users, companies, sessions)

## Data Flow

1. **Resume Upload**: User uploads resume → File processing → AI analysis → Database storage
2. **Interview Preparation**: Resume analysis → Company research → Question generation
3. **Mock Interview**: Question delivery → User response → AI evaluation → Feedback
4. **Real-time Assistance**: Speech recognition → Context analysis → Suggestion generation
5. **History Tracking**: Session data → Database storage → Analytics dashboard

## External Dependencies

### AI Services
- **Google Gemini**: Primary AI provider for analysis and conversation
- **OpenAI**: Alternative provider for text processing
- **Anthropic**: Claude integration for advanced reasoning
- **Hugging Face**: Open-source model support

### Infrastructure
- **Neon Database**: Serverless PostgreSQL for data persistence
- **File Storage**: Local file system for resume uploads
- **WebSocket Support**: Real-time communication capabilities

### Frontend Libraries
- **React Ecosystem**: React Query, React Hook Form, React Router
- **UI Framework**: Radix UI primitives with Tailwind CSS
- **Speech API**: Web Speech API for voice recognition

## Deployment Strategy

### Development
- **Hot Reload**: Vite dev server with HMR
- **Database**: Development connection to Neon
- **Environment**: Local development with environment variables

### Production
- **Build Process**: Vite build for frontend, esbuild for backend
- **Database**: Production Neon instance with connection pooling
- **Deployment**: Express server serving static files and API routes

### Configuration
- **Environment Variables**: Database URL, AI API keys
- **Database Migrations**: Drizzle Kit for schema management
- **Build Scripts**: Separate client and server build processes

## Chrome Extension

### Structure
- **Extension Directory**: `/extension/` contains the Chrome extension build
- **Manifest**: Manifest v3 compliant configuration
- **Popup Interface**: Self-contained HTML/CSS/JS popup (400x600px)
- **Features**: Real-time assistant, resume upload simulation, mock interview, company research
- **Icons**: Basic placeholder icons for Chrome store

### Installation
1. Navigate to `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked extension from `/extension/` folder
4. Extension appears in browser toolbar

### AI Integration
- **Simplified Providers**: Removed complex multi-provider system
- **Environment Variables**: `GEMINI_API_KEY` and `OPENROUTER_API_KEY` for configuration
- **Fallback Responses**: Works without API keys for basic functionality

## Changelog

Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Migrated from Replit Agent to Replit environment
- July 04, 2025. Simplified AI service to Gemini and OpenRouter only
- July 04, 2025. Created Chrome Extension version with self-contained popup

## User Preferences

Preferred communication style: Simple, everyday language.
Project Focus: Convert web app to Chrome Extension while keeping UI intact.
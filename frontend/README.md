# GosSip Frontend

GosSip is the client-side component of the GosSip chat system, featuring a unique retro aesthetic inspired by Windows 95. It is a modern Single Page Application (SPA) built with React 19 and Vite, providing a seamless real-time communication experience through WebSockets and a RESTful API.

## Design Concept

The UI is a faithful emulation of the Windows 95 environment. This choice serves as both a stylistic statement and a technical challenge in User Experience (UX), proving that modern technologies like React's Virtual DOM and asynchronous state updates can be encapsulated within a classic, tactile design without sacrificing responsiveness or fluidity.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Routing:** React Router 7
- **Communication:** Axios (REST) & Native WebSocket API
- **Icons:** Lucide React
- **Validation:** Zod & React Hook Form

## Key Features

- **Retro UI:** Windows 95-inspired windows, taskbars, and icons.
- **Real-Time Chat:** Bidirectional communication via WebSockets for instant messaging.
- **Global Notifications:** Centralized inbox for friend requests and system alerts.
- **Presence Tracking:** Real-time online/offline status and typing indicators.
- **Dynamic Theming:** Avatar color customization and user profile management.
- **Friendship System:** Integrated friend request management and private messaging.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository (if not already done):
   ```bash
   git clone git@github.com:LinconAvila/GosSip-Frontend.git
   cd GosSip-Frontend/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env` file in the root of the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   VITE_WS_URL=ws://localhost:8080/ws
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Build for Production

Build the project for production:
```bash
npm run build
```

The output will be available in the `dist/` directory, ready to be served by Nginx or any static hosting service.

## Project Structure

- `src/components`: UI components (Windows, Buttons, Modals).
- `src/hooks`: Custom React hooks for WebSockets and API calls.
- `src/store`: Global state management with Zustand (Auth, Chat, UI state).
- `src/services`: API service definitions using Axios.
- `src/pages`: Main application views (Login, Desktop, Chat Rooms).

Center of Computational Sciences – Federal University of Rio Grande (FURG)

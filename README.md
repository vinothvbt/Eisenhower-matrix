# TIME-TODO: Eisenhower Matrix Task Management

Organize your tasks using the Eisenhower Matrix methodology for maximum productivity.

## Overview

TIME-TODO is a smart task management application that helps you categorize tasks by importance and urgency, following the Eisenhower Matrix approach. It provides a clean interface for organizing, tracking, and visualizing your daily and weekly progress, making it easier to focus on what matters most.

## Features

- **Task Categorization**: Sort tasks into four quadrants—Do Now, Schedule, Delegate, and Eliminate—based on importance and urgency.
- **Real-time Updates**: Instantly see changes to your task list with live updates.
- **Weekly Insights**: Visual dashboards show completion rates, streaks, and progress using charts.
- **User Authentication**: Secure login and personalized task management.
- **Theme Support**: Toggle between light and dark modes for comfortable viewing.
- **Drag-and-Drop**: Reorder tasks easily within and between quadrants.

## Technologies Used

- **TypeScript** and **React** (with Next.js)
- **Supabase** (for data storage, authentication, and real-time updates)
- **Radix UI** (for UI primitives)
- **Framer Motion** (for smooth animations)
- **Recharts** (for data visualization)

## Eisenhower Matrix Quadrants

1. **Do Now**: Important and urgent (tasks to complete immediately)
2. **Schedule**: Important but not urgent (tasks to plan for later)
3. **Delegate**: Not important but urgent (tasks to assign to others)
4. **Eliminate**: Not important and not urgent (tasks to remove)

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vinothvbt/Eisenhower-matrix.git
   cd Eisenhower-matrix
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Supabase**
   - Create a project in [Supabase](https://supabase.com).
   - Obtain your Supabase URL and public API key.
   - Add these credentials to your environment variables (e.g., `.env.local`):
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in Browser**
   - Visit [http://localhost:3000](http://localhost:3000) to use the app.

## Project Structure

- `app/` - Next.js app structure and layout
- `components/` - UI components for the matrix, tasks, insights, and controls
- `hooks/` - Custom React hooks for tasks and Supabase integration
- `contexts/` - Providers for authentication and theme
- `lib/` - Utility functions and Supabase client

## License

This project currently does not specify a license.

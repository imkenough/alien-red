# Alien Streaming Platform

Alien is a modern streaming platform built with React, TypeScript, and Vite. It allows users to browse, search, and watch a wide variety of movies and TV shows. The platform fetches metadata from The Movie Database (TMDb) and uses VidSrc for streaming content.

## ✨ Features

- **Browse Content:** Discover trending, popular, and top-rated movies and TV shows.
- **Detailed Information:** Get comprehensive details for movies and TV series, including cast, crew, trailers, and seasons.
- **Search Functionality:** Easily find specific movies or TV shows.
- **Genre-based Discovery:** Explore content categorized by genres.
- **Streaming:** Watch movies and TV episodes directly within the platform.
- **Watchlist:** Keep track of content you want to watch. (Implied by `WatchlistContext.tsx`)
- **Responsive Design:** User interface built with Tailwind CSS and Radix UI components.

## 🛠️ Tech Stack

- **Frontend:**
    - React
    - TypeScript
    - Vite (Build Tool)
    - Tailwind CSS (Styling)
    - Radix UI (Headless UI Components)
    - React Router DOM (Routing)
- **State Management & API:**
    - React Context API (for theme, watchlist)
    - Axios (HTTP Client)
- **Data Sources:**
    - TMDb API (Movie and TV Show metadata)
    - Various streaming APIs (Streaming links)
- **Linting:**
    - ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (or yarn/pnpm)
- A TMDb API Key. You'll need to sign up at [TMDb](https://www.themoviedb.org/documentation/api) to get one.

### Installation & Setup

1. **Clone the repository:**
    
    ```bash
    git clone https://github.com/imkenough/alien-red
    cd alien-red 
    
    ```
    
2. **Install dependencies:**
    
    ```bash
    npm install
    
    ```
    
3. **Set up environment variables:**
Create a `.env` file in the root of the project and add your TMDb API key:
    
    ```
    VITE_TMDB_API_KEY=your_tmdb_api_key_here
    
    ``` 
    
4. **Run the development server:**
    
    ```bash
    npm run dev
    
    ```
    
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy - check your terminal output).
    

## 📜 Available Scripts

- `npm run dev`: Starts the development server with hot reloading.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## 📁 Project Structure

```
alien-streaming-platform/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components (general, layout, ui)
│   ├── contexts/      # React context for global state (Theme, Watchlist)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Core logic, API services (api.ts, types.ts, utils.ts)
│   ├── pages/         # Page-level components
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Entry point of the application
│   └── routes.tsx     # Application routing setup
├── .env.example       # Example environment variables (you should create .env)
├── .gitignore
├── index.html         # Main HTML file
├── package.json
├── postcss.config.js  # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript compiler options
└── vite.config.ts     # Vite configuration

```

## 🤝 Contributing    

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please ensure your code adheres to the project's linting standards (`npm run lint`).

## 💖 Support
Star this Repository :)

![174794647-0c851917-e5c9-4fb9-bf88-b61d89dc2f4f](https://github.com/user-attachments/assets/df4795f1-3181-43c7-af7f-68eb9b814d1c)






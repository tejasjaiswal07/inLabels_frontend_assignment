# Notes Application

A modern notes application built with SvelteKit and TailwindCSS, featuring a clean and intuitive user interface.

## Features

- Create, read, update, and delete notes
- Real-time search functionality
- Sort notes by creation date
- Responsive design
- Modern UI with TailwindCSS
- Error handling and loading states

## How to Run the App

1. Clone the repository:
```bash
git clone <your-repo-url>
cd inlabels_frontend_assignment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Trade-offs and Assumptions

1. **API Integration**:
   - Using mockapi.io for the backend to simulate a real API
   - Assumed the API would return data in a consistent format
   - Implemented basic error handling for API failures

2. **State Management**:
   - Used Svelte's built-in state management instead of external libraries
   - Assumed the application wouldn't need complex state management
   - Kept state management simple and component-based

3. **UI/UX Decisions**:
   - Implemented a modal for delete confirmation to prevent accidental deletions
   - Used a simple form for note creation/editing
   - Assumed users would prefer a clean, minimal interface

4. **Performance**:
   - Implemented client-side sorting and filtering
   - Assumed the number of notes would be manageable for client-side operations
   - No pagination implemented for simplicity

## Future Improvements

1. **Authentication**:
   - Add user authentication and authorization
   - Implement user-specific notes
   - Add secure API endpoints

2. **Enhanced Features**:
   - Add note categories/tags
   - Implement rich text editing
   - Add image upload support
   - Implement note sharing functionality
   - Add offline support with PWA

3. **Performance Optimizations**:
   - Implement server-side pagination
   - Add caching mechanisms
   - Optimize bundle size
   - Add lazy loading for components

4. **Testing**:
   - Add unit tests for components
   - Implement integration tests
   - Add end-to-end testing
   - Set up CI/CD pipeline

5. **UI/UX Improvements**:
   - Add dark mode support
   - Implement keyboard shortcuts
   - Add drag-and-drop functionality
   - Improve mobile responsiveness
   - Add animations and transitions

6. **Code Quality**:
   - Add TypeScript strict mode
   - Implement better error boundaries
   - Add comprehensive documentation
   - Set up code quality tools (ESLint, Prettier)

## Technologies Used

- SvelteKit
- TypeScript
- TailwindCSS
- MockAPI.io (for backend simulation)

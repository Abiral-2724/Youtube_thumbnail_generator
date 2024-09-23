# YouTube Thumbnail Generator

YouTube Thumbnail Generator is a web application that allows users to easily create, manage, and download thumbnail collections from YouTube videos.

## Features

- Generate thumbnail from youtube url 
- Create and manage collections of YouTube thumbnails
- Search and filter collections
- Add thumbnails from YouTube video URLs
- Download individual thumbnails or entire collections 
- User authentication and authorization
  

## Technologies Used

- Frontend:
  - React.js
  - Redux for state management
  - Material-UI for styling
  - Axios for API requests

- Backend:
  - Node.js
  - Express.js
  - MongoDB for database
  - Mongoose for object modeling
  - JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Abiral-2724/Youtube_thumbnail_generator.git
   cd Youtube_thumbnail_generator
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory and add the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=8000
   ```

4. Start the backend server:
   ```
   cd backend
   npm start
   ```

5. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000` to use the application.

## Usage

1. Register a new account or log in to an existing one.
2. Create a new collection by clicking the "Add Collection" button.
3. Select a collection and paste a YouTube video URL to add its thumbnail.
4. Use the search bar to find specific collections.
5. Download individual thumbnails or entire collections as needed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

Abiral Jain - [GitHub Profile](https://github.com/Abiral-2724)

Project Link: [https://github.com/Abiral-2724/Youtube_thumbnail_generator](https://github.com/Abiral-2724/Youtube_thumbnail_generator)

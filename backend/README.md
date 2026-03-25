# भान्साSATHI Food Community Backend

A Node.js/Express.js backend API for the भान्साSATHI Food Community Engagement Platform.

## Features

- **Authentication**: User registration and login with JWT
- **User Management**: Profile management, following/following system
- **Recipes**: CRUD operations for recipes with ratings and reviews
- **Events**: Community food events management
- **Community**: Social posts with likes and comments
- **Security**: Rate limiting, CORS, helmet security headers

## Tech Stack

- Node.js with ES modules
- Express.js framework
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- Joi for input validation
- Morgan for logging
- Rate limiting and security middleware

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- Set your MongoDB connection string
- Generate a secure JWT secret
- Configure frontend URL

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/follow/:id` - Follow user
- `POST /api/users/unfollow/:id` - Unfollow user

### Recipes
- `GET /api/recipes` - Get all recipes (with filtering)
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required)
- `DELETE /api/recipes/:id` - Delete recipe (auth required)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event (auth required)
- `POST /api/events/:id/attend` - Join event (auth required)

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post (auth required)
- `POST /api/community/posts/:id/like` - Like/unlike post (auth required)
- `POST /api/community/posts/:id/comments` - Add comment (auth required)

### Health Check
- `GET /api/health` - API health status

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend application URL
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `RATE_LIMIT_WINDOW_MS` - Rate limit window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

## Database Schema

### User
- Basic profile information
- Social features (followers/following)
- Statistics tracking

### Recipe
- Recipe details and instructions
- Author information
- Ratings and reviews
- Categories and tags

### Event
- Event details and location
- Host and attendees
- Date and time management

### Community Post
- Social posts with content
- Likes and comments
- Author information

## Security Features

- JWT authentication
- Password hashing with bcryptjs
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation with Joi
- Error handling and logging

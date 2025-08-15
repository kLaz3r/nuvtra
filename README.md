# NUVTRA - Social Media Platform

NUVTRA is a modern social media platform built with Next.js, TypeScript, and PostgreSQL. It enables users to connect, share posts, follow others, and engage through likes and comments.

## Features

- **User Authentication**: Secure login and registration via Clerk
- **Social Interactions**: Post creation, comments, likes, and follows
- **Real-time Notifications**: Alerts for likes, comments, and new followers
- **Profile Management**: Customizable user profiles with bio and avatar
- **Search Functionality**: Find users and posts by keywords
- **Responsive Design**: Optimized for both mobile and desktop

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **File Storage**: UploadThing
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
POSTGRES_URL=postgresql://postgres:password@localhost:5432/nuvtra
NODE_ENV=development
```

### Database Setup

Run the included script to start a PostgreSQL container:

```bash
chmod +x start-database.sh
./start-database.sh
```

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Generate and push the database schema:

```bash
pnpm db:generate
pnpm db:push
```

### Development

Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

The application uses the following main tables:

- `nuvtra_user`: User profiles and authentication
- `nuvtra_post`: User-created content
- `nuvtra_comment`: Comments on posts
- `nuvtra_like`: Post likes
- `nuvtra_follow`: User follow relationships
- `nuvtra_notification`: System notifications

## API Endpoints

### Users

- `POST /api/users/create`: Create a new user
- `POST /api/users/update`: Update user profile
- `POST /api/users/get`: Get user details

### Posts

- `POST /api/posts/create`: Create a new post
- `GET /api/posts/get`: Get all posts with pagination
- `GET /api/posts/get/[post-id]`: Get a specific post

### Comments

- `POST /api/comments/create`: Add a comment to a post

### Notifications

- `POST /api/notifications/get`: Get user notifications
- `POST /api/notifications/mark-read`: Mark notification as read

### Search

- `GET /api/search/posts`: Search posts
- `GET /api/search/users`: Search users

### File Upload

- `POST /api/uploadthing`: Handle file uploads

## Project Structure

- `/src/app`: Next.js app router pages and API routes
- `/src/components`: Reusable React components
- `/src/server/db`: Database schema and connection
- `/src/styles`: Global CSS styles
- `/src/lib`: Utility functions
- `/drizzle`: Database migration files

## Scripts

- `pnpm build`: Build the application
- `pnpm dev`: Start development server
- `pnpm start`: Start production server
- `pnpm check`: Run linting and type checking
- `pnpm db:generate`: Generate database migrations
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open Drizzle Studio for database management

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

None

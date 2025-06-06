# LiskPredict Trade UI

A modern web application for cryptocurrency trading predictions and portfolio management, built with React, Express, and TypeScript.

## Features

- Real-time cryptocurrency price tracking
- Trading predictions and analysis
- Portfolio management
- Sentiment analysis from news sources
- User authentication and authorization
- Responsive design with modern UI components

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - React Query
  - Wouter for routing
  - Framer Motion for animations

- **Backend:**
  - Express.js
  - TypeScript
  - Drizzle ORM
  - PostgreSQL (Neon Serverless)
  - WebSocket for real-time updates

## Prerequisites

- Node.js (v20 or higher)
- pnpm (v10 or higher)
- PostgreSQL database

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd LiskPredictTradeUI
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_database_url
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   ```

4. Set up the database:
   ```bash
   pnpm db:push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5000`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` - Type check
- `pnpm db:push` - Push database schema changes

## Project Structure

```
LiskPredictTradeUI/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── hooks/     # Custom React hooks
│   │   └── lib/       # Utility functions
├── server/            # Backend Express application
│   ├── routes.ts     # API routes
│   ├── storage.ts    # Database operations
│   └── vite.ts       # Vite configuration
├── shared/           # Shared types and utilities
└── package.json      # Project dependencies
```

## API Endpoints

- `GET /api/predictions` - Get trading predictions
- `GET /api/trades` - Get user trades
- `GET /api/sentiment` - Get market sentiment
- `GET /api/portfolio/:userId` - Get user portfolio

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Drizzle ORM](https://orm.drizzle.team/) for database operations 
# LifeAtEther Social Media Platform

A modern social media platform designed specifically for office environments, built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication System**

  - Secure user registration and login
  - JWT-based authentication
  - Role-based access control

- **Social Features**

  - Feed management with pagination
  - Post creation and management
  - Comments and reactions
  - User mentions and notifications
  - Media upload support

- **Dashboard & Analytics**
  - User engagement metrics
  - Activity tracking
  - Performance analytics
  - Customizable reports

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT, bcrypt
- **Security**: Helmet, CORS
- **Development**: Nodemon, ESLint
- **Process Manager**: PM2

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- PM2 (for production deployment)

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd leaderboard
   ```

2. **Install dependencies**

   ```bash
   cd lifeatether-engine
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `lifeatether-engine` directory with the following variables:

   ```
   NODE_ENV=development
   PORT=3098
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=lifeatether
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

4. **Database Setup**

   ```bash
   # Create database
   createdb lifeatether

   # Run migrations (if available)
   npm run migrate
   ```

5. **Development**

   ```bash
   npm run dev
   ```

6. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Project Structure

```
lifeatether-engine/
├── src/              # Source files
├── dist/             # Compiled JavaScript
├── public/           # Static files
├── docs/             # Documentation
├── postman/          # API documentation and tests
└── logs/             # Application logs
```

## 📚 API Documentation

The API documentation is available in the `postman` directory. Import the Postman collection to test all available endpoints.

## 🚀 Deployment

The application is configured to run with PM2 in production. Use the provided ecosystem config:

```bash
pm2 start ecosystem.config.js
```

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript files
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please contact the development team or create an issue in the repository.

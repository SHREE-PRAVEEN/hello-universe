# Hello Universe!

Production-ready full-stack robotics ecosystem platform.

## 1) Backend setup (folder structure first)

```text
backend/
	prisma/
		schema.prisma
	src/
		app.js
		server.js
		config/
			env.js
			cloudinary.js
		controllers/
			auth.controller.js
			user.controller.js
			course.controller.js
			solution.controller.js
			product.controller.js
			order.controller.js
			guide.controller.js
			configurator.controller.js
		services/
			auth.service.js
			user.service.js
			course.service.js
			solution.service.js
			product.service.js
			order.service.js
			guide.service.js
			configurator.service.js
		routes/
			index.js
			auth.routes.js
			user.routes.js
			course.routes.js
			solution.routes.js
			product.routes.js
			order.routes.js
			guide.routes.js
			configurator.routes.js
		middlewares/
			auth.middleware.js
			validate.middleware.js
			error.middleware.js
		validations/
			auth.validation.js
			course.validation.js
			solution.validation.js
			product.validation.js
			guide.validation.js
			order.validation.js
			configurator.validation.js
		utils/
			prisma.js
			apiError.js
			asyncHandler.js
	.env.example
	package.json
```

### Backend highlights
- REST API versioning under `/api/v1`.
- MVC architecture with strict controller/service separation.
- JWT-based auth + role-based authorization (`ADMIN`, `USER`).
- Zod input validation middleware.
- Centralized error handling middleware.
- Prisma ORM with PostgreSQL schema.
- Cloudinary config scaffold for media storage.

## 2) Prisma schema

Implemented in [backend/prisma/schema.prisma](backend/prisma/schema.prisma) with these models:
- `User`
- `Course`
- `Lesson`
- `Progress`
- `Solution`
- `Product`
- `Order`
- `OrderItem`
- `Cart`
- `CartItem`
- `Guide`
- `Review`
- `SavedItem`

Also includes enums for:
- `Role`
- `SolutionCategory`
- `ProductCategory`
- `OrderStatus`

## 3) API routes and controllers

Base URL: `http://localhost:5000/api/v1`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### Users
- `GET /users/me`
- `PATCH /users/me`
- `POST /users/saved-items`

### Learning module
- `GET /courses`
- `GET /courses/:slug`
- `POST /courses` (admin)
- `PATCH /courses/:id` (admin)
- `POST /courses/:courseId/lessons` (admin)
- `POST /courses/progress`

### Solutions hub
- `GET /solutions`
- `GET /solutions/:slug`
- `POST /solutions` (admin)

### Marketplace
- `GET /products`
- `GET /products/:slug`
- `POST /products` (admin)
- `GET /products/cart/me`
- `POST /products/cart/items`
- `POST /products/:productId/reviews`

### Orders
- `GET /orders/me`
- `POST /orders`

### DIY Guides
- `GET /guides`
- `GET /guides/:slug`
- `POST /guides`

### Robot Configurator
- `POST /configurator/recommend`

## 4) Frontend structure and pages

```text
frontend/
	app/
		page.tsx
		courses/page.tsx
		courses/[slug]/page.tsx
		solutions/page.tsx
		solutions/[slug]/page.tsx
		marketplace/page.tsx
		marketplace/[slug]/page.tsx
		cart/page.tsx
		dashboard/page.tsx
		guides/page.tsx
		configurator/page.tsx
	components/
		nav.tsx
		page-shell.tsx
		cards.tsx
	lib/
		api.ts
	types/
		index.ts
	.env.example
```

Implemented pages:
- Home
- Courses
- Course Detail
- Solutions
- Solution Detail
- Marketplace
- Product Detail
- Cart
- Dashboard

Additional included pages:
- DIY Guides
- Robot Configurator

Frontend highlights:
- Next.js App Router + TypeScript + Tailwind CSS.
- Reusable cards/layout/navigation components.
- Axios API integration in `lib/api.ts`.
- Search/filter-ready endpoints via query params.
- Responsive grid layout and clean UI shell.

## 5) Setup and run instructions

### Prerequisites
- Node.js 20+
- PostgreSQL 14+

### Backend
```bash
cd backend
npm install
cp .env.example .env
# update DATABASE_URL and JWT_SECRET
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Backend runs at `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Production-readiness notes
- Uses modular architecture for scale and future AI integration.
- Clean separation of route/controller/service/validation concerns.
- Environment-driven configuration.
- Secure auth primitives (JWT + hashed passwords).
- Extendable storage provider support (Cloudinary now, S3-compatible path available).

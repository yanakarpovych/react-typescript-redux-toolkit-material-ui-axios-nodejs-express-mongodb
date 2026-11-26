# Travel Diaries

Travel Diaries is a full-stack web application for sharing travel stories. Readers can browse entries by location, date, and author. Users can create an account, publish a diary entry with a photo, and manage their posts from their profile.

## Demo

[Live Demo](https://travel-diaries-iwxutre10-yana-39dd.vercel.app/)

## Features

- Browse travel diary cards with a photo, location, travel date, description, and author.
- Sign up, log in, and log out.
- Create, edit, and delete travel entries.
- View your profile and all your published posts in one place.
- Use the app on desktop and mobile.

## Technologies

- **Frontend** — React, TypeScript, Vite, React Router, Redux Toolkit, Material UI, Axios
- **Backend** — Node.js, Express, TypeScript, Mongoose, bcryptjs
- **Database** — MongoDB Atlas

## Getting Started

Use Node.js 24, npm, and a MongoDB Atlas database user with read and write access to your database. Allow your development machine’s IP address in Atlas.

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/yanakarpovych/react-typescript-redux-toolkit-material-ui-axios-nodejs-express-mongodb.git travel-diaries
cd travel-diaries
npm --prefix backend ci
npm --prefix frontend ci
```

Run the remaining commands from the repository root.

### 2. Configure MongoDB

In `backend/app.ts`, update the database username and cluster hostname in the MongoDB connection string to match your Atlas cluster. The backend reads the password from `backend/.env`. Create that file with the following entry and keep it out of Git:

```dotenv
DATABASE_PASSWORD="your_database_user_password"
```

### 3. Start the backend and frontend

In the first terminal, start the API:

```bash
npm --prefix backend run dev
```

Open [the posts endpoint](http://localhost:5000/posts) to check the connection. An empty database returns `{"posts":[]}`.

In a second terminal, start the frontend:

```bash
npm --prefix frontend run dev -- --port 5173 --strictPort
```

Open [Travel Diaries locally](http://localhost:5173). The frontend uses `http://localhost:5000` by default. To use a different API, set `VITE_API_URL` in `frontend/.env` and restart Vite.

### 4. Build for production

```bash
npm --prefix backend run build
npm --prefix frontend run build
```

## Deployment

- **Frontend** — Vercel. Set `VITE_API_URL` to the Render API URL before building. To deploy from the terminal, run `npx vercel --prod` inside `frontend`.
- **Backend** — Render. Use `backend` as the root directory, `npm ci --include=dev && npm run build` as the build command, and `npm start` as the start command. Set `DATABASE_PASSWORD` and set `FRONTEND_URL` to the production frontend origin.
- **Database** — MongoDB Atlas. Include the backend service’s outbound IP ranges in the Atlas IP access list.

# github-repo-notes

Time Started:   2024-07-10T19:17:02Z  
Time Completed: 2024-07-12T23:49:56Z

## Description

This project is a simple web application that allows users to search for GitHub repositories and enables a user to check each individual repository. The project is split into two parts: a frontend and a backend. The frontend is built using React and the backend is built using Node.js and Express. The backend uses MongoDB to store the notes for each repository.

## Setup Instructions

### GitHub API Token

To run the project, you will need to amend the existing `.env` file in the `./backend` directory of the project. You will need to add a `GITHUB_API_TOKEN` token to the `.env` file. The GitHub API token is used to make requests to the GitHub API. You can create a GitHub API token by following the instructions [here](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token).

### Docker

#### Docker Setup: `npm run init`

Initializes the project by installing the necessary dependencies for the frontend and backend. As well as building the Docker images for frontend and backend.

#### Docker: `docker-compose up` or `npm run dev`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
This command will start the frontend, backend and MongoDB servers.

## Front end

### FE: Available Scripts

In the frontend directory, you can run:

#### FE: `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### FE: `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### FE: `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Backend

### BE: Available Scripts

In the backend directory, you can run:

#### BE: `npm start`

Used during docker-compose to start the server in production mode, prior to compiling the TypeScript code.

#### BE: `npm run dev`

Compiles the TypeScript code into the /dist directory and runs the app in the development mode.

#### BE: `npm run build`

Compiles the TypeScript code into the /dist directory.

import {isAxiosError} from "axios";
import express, {Application, NextFunction, Request, Response} from "express";
import {getBranches, getOrganisationByLogin, getOrganisationRepos, getUserDetails} from "./helpers/github-helpers.js";

const app: Application = express();

const allowedOrigins = ["http://localhost:3000"];

app.use(express.json());
app.use(function (req: Request, res: Response, next) {
	const origin = req.header("origin") as string;
	if (allowedOrigins.indexOf(origin) !== -1) {
		res.header("Access-Control-Allow-Origin", origin);
		res.header("Access-Control-Allow-Credentials", "true");
		res.header("Access-Control-Expose-Headers", "Content-Disposition");
	} else {
		res.header("Access-Control-Allow-Origin", "*");
	}

	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-external-id",
	);

	if (process.env.IS_LOCAL) console.log(req.method, req.url);
	next();
});

app.use((req: Request, res: Response, next) => {
	if (!process.env.GITHUB_API_TOKEN) {
		// This is a security measure to ensure that the server is not started without the GITHUB_API_TOKEN environment variable set.
		// any request to the server will return a 500 status code
		res.status(500).send("GITHUB_API_TOKEN is not set");
	}
	next();
});

app.get("/api/user", async (req: Request, res: Response) => {
	try {
		const user = await getUserDetails();

		res.status(200).json(user);
	} catch (err) {
		throw err;
	}
});

app.get("/api/organisation", async (req: Request, res: Response) => {
	const login = req.query.name as string;

	if (!login) {
		res.status(400).send("Name is required");
		return;
	}

	try {
		const organisation = await getOrganisationByLogin(login);

		res.status(200).json(organisation);
	} catch (err) {
		if (isAxiosError(err) && err.response?.status === 404) {
			res.status(404).json({message: "We couldn't find this organisation"});
		} else {
			throw err;
		}
	}
});

app.get("/api/organisation/:login/repos", async (req: Request, res: Response) => {
	const page = req.query.page as string | number;
	const per_page = req.query.per_page as string | number;

	const login = req.params.login;

	if (!login) {
		res.status(400).json({message: "Organisation Name is required"});
		return;
	}

	try {
		const repos = await getOrganisationRepos({login, page, per_page});

		res.status(200).json(repos);
	} catch (err) {
		if (isAxiosError(err) && err.response?.status === 404) {
			res.status(404).json({message: "We could not find repositories for this organisation"});
		} else {
			throw err;
		}
	}
});

app.get("/api/organisation/:login/repos/:repo/branches", async (req: Request, res: Response) => {
	const login = req.params.login;
	const repo = req.params.repo;

	if (!login || !repo) {
		res.status(400).json({message: "Organisation Name and Repository Name are required"});
		return;
	}

	try {
		const branches = await getBranches({login, repo});
		res.status(200).json(branches);
	} catch (err) {
		if (isAxiosError(err) && err.response?.status === 404) {
			res.status(404).json({message: "We could not find branches for this repository"});
		} else {
			throw err;
		}
	}
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	// This is a generic error handler that will catch any errors that are thrown in the application.
	if (isAxiosError(err)) {
		res.status(err.response?.status || 500).send(err.response?.data);
	} else {
		console.error(err.stack);
		res.status(500).send({
			message: err?.toString?.() || "We encountered an error processing your request",
		});
	}
});

app.listen(process.env.SERVER_PORT, () => {
	console.log(`Server is running on port ${process.env.SERVER_PORT}!`);
});

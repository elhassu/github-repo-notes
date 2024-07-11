import { isAxiosError } from "axios";
import express, {Application, Request, Response} from "express";
import { getOrganisationByLogin, getOrganisationRepos, getUserDetails } from "./github-helpers.js";

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
    const user = await getUserDetails();

    res.status(200).json(user);
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
            res.status(404).json({ message: "Organisation not found" });
        } else {
            res.status(500).send(err?.toString?.() || "Internal server error");
        }
    }

})

app.get("/api/organisation/:login/repos", async (req: Request, res: Response) => {
    const page = req.query.page as string;
    const per_page = req.query.per_page as string;

    const login = req.params.login;

    if (!login) {
        res.status(400).send("Login is required");
        return;
    }

    const repos = await getOrganisationRepos({login, page, per_page});

    res.status(200).json(repos);
});

app.use((err: Error, req: Request, res: Response) => {
    // This is a generic error handler that will catch any errors that are thrown in the application.
    if (isAxiosError(err)) {
        res.status(err.response?.status || 500).send(err.response?.data);
    } else {
        console.error(err.stack);
        res.status(500).send(err?.toString?.() || "Internal server error");
    }
});

app.listen(process.env.SERVER_PORT, () => {
	console.log(`Server is running on port ${process.env.SERVER_PORT}!`);
});

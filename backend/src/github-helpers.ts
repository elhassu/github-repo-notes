import axios from "axios";
import {cleanHeaderLinkURL, constructQueryParams, extractLinkFromHeader, extractQueryParams} from "./helpers.js";

const GITHUB_URL = "https://api.github.com";

const GITHUB_HEADERS = {
	Accept: "application/vnd.github+json",
	Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
	"X-GitHub-Api-Version": "2022-11-28",
};

export type IUser = {
	avatar_url: string;
	html_url: string;
	name: string;
};

export type HandledAxiosError = {
	status: number;
	message: string;
	data: unknown;
};

export async function getUserDetails() {
	console.log("Getting user details");
	const response = await axios({
		method: "GET",
		url: `${GITHUB_URL}/user`,
		headers: GITHUB_HEADERS,
	});

	console.log(response.status);

	const {avatar_url, html_url, name} = response.data;

	return {avatar_url, html_url, name} as IUser;
}

interface Organisation {
	login: string;
	id: number;
	node_id: string;
	url: string;
	repos_url: string;
	events_url: string;
	hooks_url: string;
	issues_url: string;
	members_url: string;
	public_members_url: string;
	avatar_url: string;
	description: string;
	name?: string;
	company?: string;
	blog?: string;
	location?: string;
	email?: string;
	twitter_username?: string;
	is_verified?: boolean;
	has_organization_projects?: boolean;
	has_repository_projects?: boolean;
	public_repos?: number;
	public_gists?: number;
	followers?: number;
	following?: number;
	html_url?: string;
	created_at?: string;
	updated_at?: string;
	archived_at?: string;
	type: "Organization";
}

interface getOrganisationParams {
	per_page?: number | string;
	page?: number | string;
	includeAllData?: boolean;
}

// get the organisations the user is a member of
export async function getUserOrganisations({per_page = 30, page = 1, includeAllData}: getOrganisationParams) {
	const query = constructQueryParams({per_page: per_page?.toString(), page: page?.toString()});

	const response = await axios({
		method: "GET",
		url: `${GITHUB_URL}/user/orgs${query}`,
		headers: GITHUB_HEADERS,
	});

	// Parse the Link header for pagination URLs
	const linkHeader = response.headers.Link as string;

	const respondedOrgs = response.data as Organisation[];
	const orgsToSend = [] as Organisation[];

	// user/orgs does not return all the data for each organisation
	// all of this just to get the "name" property of the organisation
	if (includeAllData) {
		const result = await Promise.all(
			respondedOrgs.map(async (org) => {
				const orgResponse = await axios({
					method: "GET",
					url: org.url,
					headers: GITHUB_HEADERS,
				});

				return orgResponse.data;
			}),
		);

		orgsToSend.push(...result);
	} else {
		orgsToSend.push(...respondedOrgs);
	}

	// If the Link header is present, extract the next and last links
	if (linkHeader) {
		// split the returned links into an array

		const {link: nextLink, page: nextPage} = extractLinkFromHeader(linkHeader, "next") || {};
		const {link: lastLink, page: lastPage} = extractLinkFromHeader(linkHeader, "last") || {};

		return {
			nextLink,
			lastLink,
			nextPage,
			lastPage,
			data: orgsToSend,
		};
	} else {
		return {data: orgsToSend};
	}
}

interface getOrganisationDetailsParams {
	includeAllData?: boolean;
}

// get all the organisations the user is a member of
export async function getAllUserOrganisations({includeAllData}: getOrganisationDetailsParams) {
	const response = await getUserOrganisations({per_page: 100, page: 1});

	let organisations = response.data;

	if (response.nextPage) {
		const moreItems = await getUserOrganisations({per_page: 100, page: response.nextPage});
		organisations = [...organisations, ...moreItems.data];
	}

	return organisations;
}

// iterate through the organisations and return the organisation that matches the name
// avoid getting full list due to users with a lot of organisations
export async function findUserOrganisationByName(name: string) {
	const response = await getUserOrganisations({per_page: 100, page: 1});

	const org = response.data.find((org) => [org.login, org.name].includes(name));

	if (!org && response.nextPage) {
		const moreItems = await getUserOrganisations({per_page: 100, page: response.nextPage});
		return moreItems.data.find((org) => [org.login, org.name].includes(name));
	} else {
		return org;
	}
}

// at 2024-07-11T04:16:29Z I realised that the task may be referring to the "login" and not the "name" property of the organisation
// I will add a new function to search for the organisation by the login property
// I also realised that the task may be referring to all organisations and not just the user's organisations

// get the organisation by the login
export async function getOrganisationByLogin(login: string) {
	const response = await axios({
		method: "GET",
		url: `${GITHUB_URL}/orgs/${login}`,
		headers: GITHUB_HEADERS,
	});

	return response.data;
}

interface getOrganisationReposParams {
	login: string;
	page: number | string;
	per_page?: number | string;
}

export async function getOrganisationRepos({login, page = 1, per_page = 10}: getOrganisationReposParams) {
	const query = constructQueryParams({page: page.toString(), per_page: per_page.toString()});

	const response = await axios({
		method: "GET",
		url: `${GITHUB_URL}/orgs/${login}/repos${query}`,
		headers: GITHUB_HEADERS,
	});

	return {
		data: response.data,
		nextPage: extractLinkFromHeader(response.headers.Link, "next"),
		lastPage: extractLinkFromHeader(response.headers.Link, "last"),
	};
}

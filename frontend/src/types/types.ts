export type IUser = {
	avatar_url: string;
	html_url: string;
	name: string;
}

export type IOrganisation = {
	id: number;
	name: string;
	description: string | undefined | null;
	email: string | undefined | null;
	collaborators: number;
	total_private_repos: number;
	public_repos: number;
	avatar_url: string | undefined | null;
	html_url: string;
	location: string | undefined | null;
	followers: number;
	following: number;
};

export type IRepository = {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    number_of_branches: number;
    language: string;
}
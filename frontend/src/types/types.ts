export type IUser = {
	avatar_url: string;
	html_url: string;
	name: string;
}

export type IOrganisation = {
    id: number;
    company: string;
    description: string | undefined | null;
    email: string | undefined | null;
    collaborators: number;
    private_repositories: number;
    public_repositories: number;
    avatar: string | undefined | null;
    html_url: string;
    location: string | undefined | null;
    followers: number;
    following: number;
}

export type IRepository = {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    number_of_branches: number;
    language: string;
}
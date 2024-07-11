export type IUser = {
	avatar_url: string;
	html_url: string;
	name: string;
}

export type IOrganisation = {
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
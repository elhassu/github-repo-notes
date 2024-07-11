import "./App.scss";
import MobileNavbar from "./components/common/MobileNavbar";
import Navbar from "./components/common/Navbar";
import TopBar from "./components/common/TopBar";
import OrganisationOverview from "./components/organisation/Overview";
import {useToggleSidebar} from "./hooks/UIHooks";
import {IOrganisation, IUser} from "./types/types";

export default function App() {
	const {isOpen, toggleSidebar} = useToggleSidebar();

	// TODO: replace with actual get user hook
	const user = {
		avatar_url:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		html_url: "https://github.com/elhassu",
		name: "Keelan Vella",
	} satisfies IUser;

	// TODO: replace with actual get organisation hook
	const organisation = {
		company: "Planetaria",
		description: "The future of the web is in your hands.",
		email: "octocat@github.com",
		collaborators: 3,
		private_repositories: 3,
		public_repositories: 3,
		avatar: "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500",
		html_url: "https://www.github.com/planetaria",
		location: "San Francisco, CA",
		followers: 3,
		following: 3,
	} satisfies IOrganisation;

	// temporarily return nothing
	// TODO return error page if user is null in the future
	if (!user) return null;

	return (
		<>
			<MobileNavbar
				{...{
					user,
					sidebarOpen: isOpen,
					setSidebarOpen: toggleSidebar,
				}}
			/>
			<Navbar user={user} />
			<TopBar setSidebarOpen={toggleSidebar} />

			<main className='lg:pr-96'></main>

			{organisation ? <OrganisationOverview organisation={organisation} /> : null}
		</>
	);
}

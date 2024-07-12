import "./App.scss";

import MobileNavbar from "./components/common/MobileNavbar";
import Navbar from "./components/common/Navbar";
import TopBar from "./components/common/TopBar";

import RepositoryList from "./components/list/RepositoryList";
import OrganisationOverview from "./components/organisation/Overview";

import { useToggleSidebar } from "./hooks/UIHooks";
import useOrganisation from "./store/organisationStore";
import useUser from "./store/userStore";

export default function App() {
	const {isOpen, toggleSidebar} = useToggleSidebar();
	const {user, loading: userIsLoading} = useUser();
	const {organisation, checkedRepos, loading: organisationIsLoading, getOrganisation} = useOrganisation();

	// temporarily return nothing
	// TODO return error page if user is null in the future
	if (userIsLoading) return null;

	return (
		<div>
			<MobileNavbar
				{...{
					user,
					sidebarOpen: isOpen,
					setSidebarOpen: toggleSidebar,
				}}
			/>
			<Navbar user={user} />
			<div className='xl:pl-72'>
				<TopBar {...{
					setSidebarOpen: toggleSidebar,
					getOrganisation,
					organisationIsLoading,
				}} />

				<main className='lg:pr-96'>
					<RepositoryList checkedRepos={checkedRepos} organisation={organisation?.login} />
				</main>
			</div>

			{organisation ? <OrganisationOverview organisation={organisation} /> : null}
		</div>
	);
}

import {Bars3Icon, MagnifyingGlassIcon, ArrowPathIcon} from "@heroicons/react/20/solid";

interface TopBarProps {
	setSidebarOpen: () => void;
	getOrganisation: (name: string) => void;
	organisationIsLoading: boolean;
}

export default function TopBar({setSidebarOpen, getOrganisation, organisationIsLoading}: TopBarProps) {
	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		const name = new FormData(e.currentTarget).get("search") as string;
		e.preventDefault();
		getOrganisation(name);
	};

	const SearchIcon = organisationIsLoading ? ArrowPathIcon : MagnifyingGlassIcon;

	return (
		<>
			{/* Sticky search header */}
			<div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 px-4 shadow-sm sm:px-6 lg:px-8'>
				<SidebarToggleButton setSidebarOpen={setSidebarOpen} />
				<div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
					<form
						method='GET'
						onSubmit={handleSearch}
						className='flex flex-1'>
						<label
							htmlFor='search-field'
							className='sr-only'>
							Search
						</label>
						<div className='relative w-full'>
							<SearchIcon
								aria-hidden='true'
								className={"pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500" + (organisationIsLoading ? " animate-spin" : "")}
							/>
							<input
								id='search-field'
								name='search'
								type='search'
								placeholder='Search Organisation...'
								disabled={organisationIsLoading}
								className='block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-gray-900 focus:ring-0 sm:text-sm'
							/>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

function SidebarToggleButton({setSidebarOpen}: {setSidebarOpen: () => void}) {
	return (
		<button
			type='button'
			onClick={() => setSidebarOpen()}
			className='-m-2.5 p-2.5 text-gray-900 xl:hidden'>
			<span className='sr-only'>Open sidebar</span>
			<Bars3Icon
				aria-hidden='true'
				className='h-5 w-5'
			/>
		</button>
	);
}

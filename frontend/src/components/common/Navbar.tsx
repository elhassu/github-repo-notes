import {IUser} from "../../types/types";
import Navigation from "./Navigation";

interface NavbarProps {
	user: IUser;
}

export default function Navbar({user}: NavbarProps) {
	return (
		<div className='hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col'>
			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-700 px-6 ring-1 ring-white/5'>
				<div className='flex h-16 shrink-0 items-center gap-2 text-white'>
					<img
						alt='Your Company'
						src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
						className='h-8 w-auto'
					/>
					<h1>GitHub Repo Notes</h1>
				</div>
				<nav className='flex flex-1 flex-col'>
					<ul
						className='flex flex-1 flex-col gap-y-7'>
						<li>
							<Navigation />
						</li>
						<li className='-mx-6 mt-auto'>
							<a
								target='__blank'
								href={user?.html_url}
								className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white/75 hover:bg-gray-800'>
								<img
									alt="Your profile's avatar"
									src={user?.avatar_url}
									className='h-8 w-8 rounded-full bg-white'
								/>
								<span className='sr-only'>Your profile</span>
								<span aria-hidden='true'>{user?.name}</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

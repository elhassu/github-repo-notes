import { EnvelopeIcon, LinkIcon, MapPinIcon, UserIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/20/solid";

import { IOrganisation } from "../../types/types";

export type OrganisationOverviewProps = {
	organisation: IOrganisation;
};

export default function OrganisationOverview({organisation}: OrganisationOverviewProps) {
	const {
		company,
		description,
		email,
		collaborators,
		private_repositories,
		public_repositories,
		avatar,
		html_url,
		location,
		followers,
		following,
	} = organisation;

	return (
		<aside className='lg:border-l border-solid border-gray-200 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 w-full sm:w-3/4 lg:w-96 mx-auto lg:mx-0 lg:overflow-y-auto'>
			<header className='flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8'>
				<h2 className='text-base font-semibold leading-7 text-gray-900'>Currently Viewing</h2>
			</header>
			<div className='px-4 py-6 sm:px-6 lg:px-8'>
				<div className='flex items-center gap-x-4'>
					{avatar ? (
						<img
							src={avatar}
							alt={`${company} avatar`}
							className='w-16 h-16 rounded-lg bg-white p-1'
						/>
					) : null}
					<div>
						<h1 className='text-2xl font-semibold leading-7 text-gray-900'>{company}</h1>
						<p className='text-sm leading-5 text-gray-400'>{description}</p>
					</div>
				</div>
				<div className='details'>
					<a
						href={html_url}
						target='__blank'>
						<LinkIcon />
						<span className='text-sm leading-5'>{html_url.replace("https://", "")}</span>
					</a>
					{email ? (
						<div>
							<EnvelopeIcon />
							<p className='text-sm leading-5'>{email}</p>
						</div>
					) : null}
					{location ? (
						<div>
							<MapPinIcon />
							<p className='text-sm leading-5'>{location}</p>
						</div>
					) : null}
				</div>
				<div className='stats divide-x-2 grid-cols-3'>
					<div>
						<UserPlusIcon />
						<p className='text-sm leading-5 text-gray-400'>{collaborators} collaborators</p>
					</div>
					<div>
						<UsersIcon />
						<p className='text-sm leading-5 text-gray-400'>{followers} followers</p>
					</div>
					<div className='flex flex-col items-center gap-x-2 pl-2'>
						<UserIcon />
						<p className='text-sm leading-5 text-gray-400'>{following} following</p>
					</div>
				</div>
				<h2 className='text-base font-semibold leading-7 text-gray-700 mt-6 text-center'>Repositories</h2>
				<div className='stats divide-x-2 grid-cols-2'>
					<div>
						<p className='text-sm leading-5 text-gray-400'>{private_repositories} private</p>
					</div>
					<div className='flex flex-col items-center gap-x-2 pl-2'>
						<p className='text-sm leading-5 text-gray-400'>{public_repositories} public</p>
					</div>
				</div>
			</div>
		</aside>
	);
}

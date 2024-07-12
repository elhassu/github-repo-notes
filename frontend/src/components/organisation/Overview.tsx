import {EnvelopeIcon, LinkIcon, MapPinIcon, UserIcon, UserPlusIcon, UsersIcon} from "@heroicons/react/20/solid";

import {IOrganisation} from "../../types/types";

export type OrganisationOverviewProps = {
	organisation: IOrganisation;
};

export default function OrganisationOverview({organisation}: OrganisationOverviewProps) {
	const {
		name,
		description,
		email,
		collaborators,
		total_private_repos,
		public_repos,
		avatar_url,
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
					{avatar_url ? (
						<img
							src={avatar_url}
							alt={`${name} avatar`}
							className='w-16 h-16 rounded-lg bg-white p-1'
						/>
					) : null}
					<div>
						<h1 className='text-2xl font-semibold leading-7 text-gray-900'>{name}</h1>
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
				<div className='stats'>
					{!collaborators ? null : (
						<div>
							<UserPlusIcon />
							<p className='text-sm leading-5 text-gray-400'>{collaborators} collaborators</p>
						</div>
					)}
					<div>
						<UsersIcon />
						<span className='text-sm leading-5 text-gray-400'>{followers} followers</span>
					</div>
					<div>
						<UserIcon />
						<span className='text-sm leading-5 text-gray-400'>{following} following</span>
					</div>
				</div>
				<h2 className='text-base font-semibold leading-7 text-gray-700 mt-6 text-center'>Repositories</h2>
				<div className='stats'>
					{typeof total_private_repos === "undefined" ? null : (
						<div>
							<span className='text-sm leading-5 text-gray-400'>{total_private_repos} private</span>
						</div>
					)}
					<div className='flex flex-col items-center gap-x-2 pl-2'>
						<span className='text-sm leading-5 text-gray-400'>{public_repos} public</span>
					</div>
				</div>
			</div>
		</aside>
	);
}

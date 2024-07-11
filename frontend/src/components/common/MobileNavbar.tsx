import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Navigation from "./Navigation";

import { IUser } from "../../types/types";

interface MobileNavbarProps {
    user: IUser;
    sidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
}

export default function MobileNavbar({ user, sidebarOpen, setSidebarOpen }: MobileNavbarProps) {

	return (
		<Dialog
			open={sidebarOpen}
			onClose={setSidebarOpen}
			className='relative z-50 xl:hidden'>
			<DialogBackdrop
				transition
				className='fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
			/>

			<div className='fixed inset-0 flex'>
				<DialogPanel
					transition
					className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full'>
					<TransitionChild>
						<div className='absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0'>
							<button
								type='button'
								onClick={() => setSidebarOpen(false)}
								className='-m-2.5 p-2.5'>
								<span className='sr-only'>Close sidebar</span>
								<XMarkIcon
									aria-hidden='true'
									className='h-6 w-6 text-gray-900'
								/>
							</button>
						</div>
					</TransitionChild>
					{/* Sidebar component */}
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
										href={user?.html_url}
										target='_blank'
                                        rel="noreferrer"
										className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white/75 hover:bg-gray-800'>
										<img
											alt={"Your profile's avatar"}
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
				</DialogPanel>
			</div>
		</Dialog>
	);
}

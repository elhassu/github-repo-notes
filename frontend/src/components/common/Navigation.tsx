import { ServerIcon } from "@heroicons/react/24/solid";
interface Navigation {
	name: string;
	href: string;
	icon: React.ComponentType<React.ComponentProps<"svg">>;
	current: boolean;
}
const navigation: Navigation[] = [{name: "Repositories", href: "#", icon: ServerIcon, current: true}];

export default function Navigation() {
    return (
			<ul
				role='list'
				className='-mx-2 space-y-1'>
				{navigation.map((item) => (
					<li key={item.name}>
						<a
							href={item.href}
                            aria-current={item.current ? "page" : undefined}
							className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6">
							<item.icon
								aria-hidden='true'
								className='h-6 w-6 shrink-0'
							/>
							{item.name}
						</a>
					</li>
				))}
			</ul>
		);
}

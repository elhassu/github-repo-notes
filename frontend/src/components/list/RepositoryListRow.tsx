import {IRepository} from "../../types/types";

interface RepositoryListRowProps {
	repository: IRepository;
	selected: boolean;
}

export default function RepositoryListRow({repository, selected}: RepositoryListRowProps) {
	return (
		<tr
			key={repository.id}
			className={selected ? "bg-gray-50" : undefined}>
			<td className='relative px-7 sm:w-12 sm:px-6'>
				{selected && <div className='absolute inset-y-0 left-0 w-0.5 bg-indigo-600' />}
				<input
					type='checkbox'
					className='absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
					value={repository.id}
					checked={selected}
					onChange={(e) => {}}
				/>
			</td>
			<td className='whitespace-nowrap py-4 pr-3 text-sm font-medium'>{repository.name}</td>
			<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
				<a
					href={repository.html_url}
					target='_blank'
					rel='noreferrer'>
					{repository.full_name}
				</a>
			</td>
			<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>{repository.number_of_branches}</td>
			<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>{repository.language}</td>
		</tr>
	);
}

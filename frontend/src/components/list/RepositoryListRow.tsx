import {forwardRef, useState} from "react";
import {IBranch, IRepository} from "../../types/types";
import {ChevronDownIcon} from "@heroicons/react/24/solid";

interface RepositoryListRowProps {
	repository: IRepository;
	loadBranches?: (repository: string) => void;
	toggleRepoSelection?: (name: string) => void;
	selected: boolean;
	index?: number;
}

const RepositoryListRow = forwardRef<HTMLTableRowElement | null, RepositoryListRowProps>((props, ref) => {
	const {repository, selected, loadBranches, toggleRepoSelection} = props;
	const [expand, setExpand] = useState(false);

	return (
		<>
			<tr
				ref={ref}
				key={repository.id}
				className={selected ? "bg-gray-50" : undefined}>
				<td className='relative px-7 sm:w-12 sm:px-6'>
					{selected && <div className='absolute inset-y-0 left-0 w-0.5 bg-indigo-600' />}
					<input
						type='checkbox'
						className='absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
						value={repository.id}
						checked={selected}
						onChange={(e) => {
							toggleRepoSelection?.(repository.name);
						}}
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
				<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
					<button
						type='button'
						onClick={() => {
							setExpand(!expand);
							loadBranches?.(repository.name);
						}}>
						<ChevronDownIcon className={`w-5 h-5 transition${expand ? " rotate-180" : ""}`} />
					</button>
				</td>
			</tr>
			{expand &&
				repository.branches?.map((branch) => (
					<BranchRow
						key={`${repository.id}-${branch.name}`}
						branch={branch}
					/>
				))}
		</>
	);
});

export default RepositoryListRow;

function BranchRow({branch}: {branch: IBranch}) {
	return (
		<tr>
			<td className='relative px-7 sm:w-12 sm:px-6'></td>
			<td
				colSpan={5}
				className='relative px-7 sm:w-12 sm:px-6 text-sm text-gray-500'>
				{branch.name}
			</td>
		</tr>
	);
}

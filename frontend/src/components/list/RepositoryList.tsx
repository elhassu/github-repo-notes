import {useOnScreen} from "../../hooks/UIHooks";
import {useRepositories} from "../../store/repositoryStore";
import RepositoryListRow from "./RepositoryListRow";

interface RepositoryListProps {
	organisation: string | null;
	checkedRepos: string[];
}

export default function RepositoryList({organisation, checkedRepos}: RepositoryListProps) {
	const [lastRowRef, isLastRowVisible] = useOnScreen();
	const {
		repositories,
		loadBranches,
		loading,
		toggleRepoSelection,
		selected: selectedRepositories,
	} = useRepositories(organisation, isLastRowVisible, checkedRepos);

	return (
		<div className='px-4 pt-4 sm:px-6 lg:px-8'>
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='text-base font-semibold leading-6 text-gray-900'>Repositories</h1>
					<p className='mt-2 text-sm text-gray-700'>A list of all the repositories in this organisation.</p>
				</div>
			</div>
			<div className='mt-8 flow-root'>
				<div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
						<div className='relative'>
							<table className='min-w-full table-fixed divide-y divide-gray-300'>
								<thead>
									<tr>
										<th
											scope='col'
											className='relative px-7 sm:w-12 sm:px-6'></th>
										<th
											scope='col'
											className='min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900'>
											Name
										</th>
										<th
											scope='col'
											className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
											URL
										</th>
										<th
											scope='col'
											className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
											Branches
										</th>
										<th
											scope='col'
											className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
											Programming Language
										</th>
										<th
											scope='col'
											className='relative py-3.5 pl-3 pr-4 sm:pr-3'>
											<span className='sr-only'>Expand</span>
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200 bg-white'>
									{repositories.map((repository, index) => {
										const selected = selectedRepositories?.includes(repository?.name);

										if (index + 1 === repositories.length) {
											return (
												<RepositoryListRow
													key={repository.id}
													selected={selected}
													repository={repository}
													toggleRepoSelection={toggleRepoSelection}
													loadBranches={loadBranches}
													ref={lastRowRef}
												/>
											);
										}
										return (
											<RepositoryListRow
												key={repository.id}
												index={index}
												repository={repository}
												toggleRepoSelection={toggleRepoSelection}
												loadBranches={loadBranches}
												selected={selected}
											/>
										);
									})}
									{loading && (
										<tr>
											<td
												colSpan={6}
												className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												Loading...
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

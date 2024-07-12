import axios, {AxiosError, Canceler, CancelTokenStatic, isAxiosError, isCancel} from "axios";
import {useDebugValue, useEffect, useReducer} from "react";
import toast from "react-hot-toast";
import {apiRequest} from "../helpers/requestHelpers";
import {IRepository} from "../types/types";

const INITIAL_STATE = {
	list: [] as IRepository[],
	nextPage: 1,
	lastPage: 2,
	organisation: null,
	selected: [] as string[],
	loading: false,
	loadingBranches: [] as string[],
};

export const Types = {
	SET_REPOSITORIES: "SET_REPOSITORIES",
	SET_PAGE_NUMBER: "SET_PAGE_NUMBER",
	ADD_LOADING_BRANCH: "LOADING_BRANCH",
	REMOVE_LOADING_BRANCH: "REMOVE_LOADING_BRANCH",
	SET_REPOSITORY_BRANCHES: "SET_REPOSITORY_BRANCHES",
	SET_LAST_PAGE: "SET_LAST_PAGE",
	ADD_REPOSITORIES: "ADD_REPOSITORIES",
	SET_SELECTED_REPOSITORIES: "SET_SELECTED_REPOSITORIES",
	ADD_SELECTED_REPOSITORIES: "ADD_SELECTED_REPOSITORIES",
	REMOVE_SELECTED_REPOSITORIES: "REMOVE_SELECTED_REPOSITORIES",
	SET_ORGANISATION: "SET_ORGANISATION",
	SET_LOADING: "SET_LOADING",
};

interface IAction {
	type: string;
	payload: any;
}

export const Actions = {
	setOrganisation: (payload: string | null) => ({type: Types.SET_ORGANISATION, payload}),
	setRepositories: (payload: {data: IRepository[]}) => ({type: Types.SET_REPOSITORIES, payload}),
	addLoadingBranch: (payload: string) => ({type: Types.ADD_LOADING_BRANCH, payload}),
	removeLoadingBranch: (payload: string) => ({type: Types.REMOVE_LOADING_BRANCH, payload}),
	setRepositoryBranches: (payload: {repo: string; branches: any}) => ({type: Types.SET_REPOSITORY_BRANCHES, payload}),
	setPageNumber: (payload: number) => ({type: Types.SET_PAGE_NUMBER, payload}),
	setLastPage: (payload: number) => ({type: Types.SET_LAST_PAGE, payload}),
	addRepositories: (payload: IRepository[]) => ({type: Types.ADD_REPOSITORIES, payload}),
	setSelectedRepositories: (payload: string[]) => ({type: Types.SET_SELECTED_REPOSITORIES, payload}),
	addSelectedRepositories: (payload: string) => ({type: Types.ADD_SELECTED_REPOSITORIES, payload}),
	removeSelectedRepositories: (payload: string) => ({type: Types.REMOVE_SELECTED_REPOSITORIES, payload}),
	setLoading: (payload: boolean) => ({type: Types.SET_LOADING, payload}),
};

export default function reducer(state = INITIAL_STATE, action: IAction) {
	switch (action.type) {
		case Types.SET_ORGANISATION:
			return {
				...state,
				organisation: action.payload,
			};
		case Types.SET_REPOSITORIES:
			return {
				...state,
				list: action.payload?.data,
			};
		case Types.ADD_REPOSITORIES:
			const newList = [...state.list, ...action.payload?.data];
			const uniqueList = Array.from(new Set(newList.map((a) => a.id))).map((id) => newList.find((a) => a.id === id));

			return {
				...state,
				list: uniqueList,
			};
		case Types.ADD_LOADING_BRANCH:
			return {
				...state,
				loadingBranches: [...state.loadingBranches, action.payload],
			};
		case Types.REMOVE_LOADING_BRANCH:
			return {
				...state,
				loadingBranches: state.loadingBranches.filter((item) => item !== action.payload),
			};
		case Types.SET_REPOSITORY_BRANCHES:
			return {
				...state,
				list: state.list.map((item) => {
					if (item.name === action.payload.repo) {
						return {
							...item,
							branches: action.payload.branches,
						};
					}
					return item;
				}),
			};
		case Types.SET_PAGE_NUMBER:
			return {
				...state,
				nextPage: action.payload,
			};
		case Types.SET_LAST_PAGE:
			return {
				...state,
				lastPage: action.payload,
			};
		case Types.SET_SELECTED_REPOSITORIES:
			return {
				...state,
				selected: action.payload,
			};
		case Types.ADD_SELECTED_REPOSITORIES:
			return {
				...state,
				selected: [...state.selected, action.payload],
			};
		case Types.REMOVE_SELECTED_REPOSITORIES:
			return {
				...state,
				selected: state.selected.filter((item) => item !== action.payload),
			};
		case Types.SET_LOADING:
			return {
				...state,
				loading: action.payload,
			};
		default:
			return state;
	}
}

export function useRepositories(
	organisation: string | null,
	lastRowVisible: boolean,
	checkedRepos: string[],
): {
	repositories: IRepository[];
	loading: boolean;
	loadBranches: (name: string) => void;
	selected: string[];
	toggleRepoSelection: (name: string) => void;
} {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	useDebugValue(
		state.loading ? "Loading" : state.list.length ? `${state.list.length} repositories` : "No repositories",
	);

	const stringifiedCheckedRepos = JSON.stringify(checkedRepos);

	useEffect(() => {
		dispatch(Actions.setSelectedRepositories(checkedRepos));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stringifiedCheckedRepos]);

	useEffect(() => {
		let cancel: null | Canceler = null;
		const newOrganisation = organisation !== state.organisation;
		const isLastPage = state.nextPage > state.lastPage;
		const canQuery = (newOrganisation || !isLastPage) && !state.loading && organisation;

		if (newOrganisation) {
			dispatch(Actions.setOrganisation(organisation));
		}

		if (!canQuery) return;

		dispatch(Actions.setLoading(true));
		apiRequest({
			method: "GET",
			path: `/organisation/${organisation}/repos`,
			query: {page: newOrganisation ? 1 : state.nextPage},
			cancelToken: new axios.CancelToken((c) => {
				cancel = c;
			}),
		})
			.then(({data}) => {
				// If the organisation is new, set the repositories, otherwise add the repositories
				if (newOrganisation) {
					dispatch(Actions.setRepositories(data));
				} else {
					dispatch(Actions.addRepositories(data));
				}

				// If the next page is not returned, assume there is no next page and increment the page number
				if (data?.nextPage) {
					dispatch(Actions.setPageNumber(data.nextPage));
				} else {
					dispatch(Actions.setPageNumber(state.lastPage + 1));
				}
				if (data?.lastPage) dispatch(Actions.setLastPage(data.lastPage));
			})
			.catch((error: AxiosError | Error | CancelTokenStatic) => {
				if (isCancel(error)) return;
				if (isAxiosError(error)) {
					console.warn(error.response?.status, error.response?.data);
					if (error.response?.data?.message) toast.error(error.response?.data?.message);
				} else {
					console.warn(error);
					toast.error("We encountered an error getting these repositories");
				}
			})
			.finally(() => {
				dispatch(Actions.setLoading(false));
			});

			return () => cancel?.();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [lastRowVisible, organisation]);

	const loadBranches = async (name: string) => {
		dispatch(Actions.addLoadingBranch(name));

		await apiRequest({
			method: "GET",
			path: `/organisation/${organisation}/repos/${name}/branches`,
		})
			.then((response) => {
				dispatch(Actions.setRepositoryBranches({repo: name, branches: response.data?.data}));
			})
			.catch((error) => {
				if (isAxiosError(error)) {
					console.warn(error.response?.status, error.response?.data);
					if (error.response?.data?.message) toast.error(error.response?.data?.message);
				} else {
					console.warn(error);
					toast.error("We encountered an error getting these branches");
				}
			})
			.finally(() => {
				dispatch(Actions.removeLoadingBranch(name));
			});
	};

	const toggleRepoSelection = (name: string) => {
		const isSelected = state.selected.includes(name);

		apiRequest({
			method: "POST",
			path: `/organisation/${organisation}/repos/${name}/check`,
			body: {checked: !isSelected},
		})
			.then(() => {
				if (isSelected) {
					dispatch(Actions.removeSelectedRepositories(name));
				} else {
					dispatch(Actions.addSelectedRepositories(name));
				}
			})
			.catch((error) => {
				if (isAxiosError(error)) {
					console.warn(error.response?.status, error.response?.data);
					if (error.response?.data?.message) toast.error(error.response?.data?.message);
					else toast.error("We encountered an error checking this repository");
				}
			});
	};

	return {
		repositories: state.list,
		loading: state.loading,
		loadBranches,
		selected: state.selected,
		toggleRepoSelection,
	};
}

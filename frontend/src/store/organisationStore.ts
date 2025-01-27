import {
	AxiosError,
	isAxiosError
} from "axios";
import { useDebugValue, useReducer } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../helpers/requestHelpers";
import { IOrganisation } from "../types/types";

const INITIAL_STATE = {
	organisation: null,
	loading: false,
	checkedRepos: [] as string[],
};

export const Types = {
	SET_ORGANISATION: "SET_ORGANISATION",
	SET_LOADING: "SET_LOADING",
	SET_CHECKED_REPOSITORIES: "SET_CHECKED_REPOSITORIES",
};

export const Actions = {
	setOrganisation: (payload: IOrganisation) => ({type: Types.SET_ORGANISATION, payload}),
	setCheckedRepositories: (payload: string[]) => ({type: Types.SET_CHECKED_REPOSITORIES, payload}),
	setLoading: (payload: boolean) => ({type: Types.SET_LOADING, payload}),
};

interface IAction {
	type: string;
	payload: any;
}

export function reducer(state = INITIAL_STATE, action: IAction) {
	switch (action.type) {
		case Types.SET_ORGANISATION:
			return {
				...state,
				organisation: action.payload,
			};
		case Types.SET_CHECKED_REPOSITORIES:
			return {
				...state,
				checkedRepos: action.payload,
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

export default function useOrganisation() {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	useDebugValue(state.loading ? "Loading" : state.organisation ? state.organisation.name : "No organisation");

	function getOrganisation(name: string): void {
		if (state.loading || !name || (name === state.organisation?.login)) return;

		dispatch(Actions.setLoading(true));
		apiRequest({
			method: "GET",
			path: "/organisation",
			query: {name}
		})
			.then((response) => {
				dispatch(Actions.setOrganisation(response.data?.organisation));
				dispatch(Actions.setCheckedRepositories(response.data?.checkedRepos));
			})

			.catch((error: AxiosError | Error) => {
				if (isAxiosError(error)) {
					console.warn(error.response?.status, error.response?.data);
					if (error.response?.data?.message) toast.error(error.response?.data?.message);
				} else {
					console.warn(error);
					toast.error("We encountered an error getting this organisation");
				}
			})
			.finally(() => {
				dispatch(Actions.setLoading(false));
			});
	}

	return {organisation: state.organisation, checkedRepos: state.checkedRepos,  loading: state.loading, getOrganisation};
}

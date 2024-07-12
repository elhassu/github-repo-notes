import {useDebugValue, useEffect, useReducer} from "react";
import toast from "react-hot-toast";
import {apiRequest} from "../helpers/requestHelpers";
import {IUser} from "../types/types";

const INITIAL_STATE = {
	user: null,
	loading: false,
};

export const Types = {
	SET_USER: "SET_USER",
	SET_LOADING: "SET_LOADING",
};

export const Actions = {
	setUser: (payload: IUser) => ({type: Types.SET_USER, payload}),
	setLoading: (payload: boolean) => ({type: Types.SET_LOADING, payload}),
};

interface IAction {
	type: string;
	payload: any;
}

export function reducer(state = INITIAL_STATE, action: IAction) {
	switch (action.type) {
		case Types.SET_USER:
			return {
				...state,
				user: action.payload,
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

export default function useUser() {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	useDebugValue(state.loading ? "Loading" : state.user ? state.user.name : "No user");

	useEffect(() => {
		if (state.loading) return;

		dispatch(Actions.setLoading(true));
		apiRequest({
			method: "GET",
			path: "/user",
		})
			.then((response) => {
				dispatch(Actions.setUser(response.data as IUser));
			})
			.catch((error) => {
				toast.error("We couldn't get your user details");
			})
			.finally(() => {
				dispatch(Actions.setLoading(false));
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {user: state.user, loading: state.loading};
}

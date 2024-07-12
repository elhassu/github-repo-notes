import axios, {AxiosHeaders, AxiosProgressEvent, AxiosRequestConfig, CancelToken} from "axios";
// cleanDeep is a function that removes all falsy values from an object
import cleanDeep from "clean-deep";

/**
 * @param object - Object to be converted to query params
 * @returns - Query params string if object is not empty, else empty string
 */
export function constructQueryParams (object: object | undefined) {
	const objectToUse = cleanDeep({...object});

	if (Object.keys(objectToUse).length === 0) return "";

	return `?${new URLSearchParams(objectToUse).toString()}`;
};

interface CreateRequestParams {
	urlPath?: string;
	local?: boolean;
}

// The apiURL should be set to the backend API URL once the backend is deployed
const apiURL = "";
// If apiURL is not set, forceLocal will be set to true - assuming the backend is not deployed
const forceLocal = !apiURL;

interface RequestParams {
	body?: object;
	path?: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	query?: object;
	url?: string;
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
	cancelToken?: CancelToken;
}

/**
 * Function that creates a request function that makes requests to the specified URL,
 * used to avoid code repetition when needing to make multiple requests to the same URL path
 * @param urlPath - Path to be appended to the API URL
 * @param local - If true, the request will be made to the local server
 * @returns - A thenable function that makes requests to the specified URL
 */
export function createRequest({urlPath, local}: CreateRequestParams) {
	return (params: RequestParams) => {
		if (forceLocal) local = true;

		const {body, path, method, query, url, onUploadProgress} = params;
		const API = local ? "http://localhost:3001" : apiURL;

		const headers = {} as AxiosHeaders;

		// Force content type and accept to be application/json if body is an object
		if (body instanceof Object) {
			headers["Content-Type"] = "application/json";
			headers["Accept"] = "application/json";
		}

		const config = {
			method,
			url: `${API}`,
			data: body,
			headers,
		} as AxiosRequestConfig;
		const stringifiedQuery = query ? constructQueryParams(query) : "";

        if (onUploadProgress) {
            config.onUploadProgress = onUploadProgress;
        }

		// by passing in the url, you can override the urlPath
		if (url) {
			config.url = url;
		} else if (path) {
			config.url += `${urlPath}${path}${stringifiedQuery}`;
		}

		return axios(config);
	};
};

export const apiRequest = createRequest({urlPath: "/api"});

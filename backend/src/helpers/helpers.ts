/**
 * Returns the URL from a header link
 * @param url
 * @returns cleaned URL
 */
export function cleanHeaderLinkURL(url: string) {
	return url.match(/<([^>]+)>/g)?.[0];
}

/**
 * Extracts query parameters from a URL
 * @param url
 * @returns object with query parameters
 */
export function extractQueryParams(url: string) {
	const query = url.split("?")[1];
	const params = new URLSearchParams(query);

	const allParams = Array.from(params.entries()).reduce((acc, [key, value]) => {
		acc[key] = value;
		return acc;
	}, {} as Record<string, string>);

	return allParams;
}

/**
 * Constructs query parameters from an object
 * @param params
 * @returns query string
 */
export function constructQueryParams(params: Record<string, string>) {
	const query = new URLSearchParams(params);
	const stringifiedQuery = query.toString();
	const queryString = stringifiedQuery ? `?${stringifiedQuery}` : "";
	return queryString;
}

/**
 * Extracts a link from a header
 * @param header
 * @param rel
 * @returns link and page number
 */
export function extractLinkFromHeader(header: string, rel: string) {
    if (!header) return null;
	// split the returned links into an array
	// find the rel link
	const link = header.split(",").find((link) => link.includes(`rel="${rel}"`)) || "";

    // if there is no link, return null
	if (!link) return null;

    // clean the link from the < and > characters
	const cleanLink = cleanHeaderLinkURL(link);

    // return the cleaned link and the page number
	return {
		link: cleanLink,
		page: cleanLink ? extractQueryParams(cleanLink).page : null,
	};
}
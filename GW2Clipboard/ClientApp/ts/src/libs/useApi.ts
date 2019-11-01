import { useEffect, useState, useRef } from 'react';

export interface IApiResult<T> {
	lastCall?: number;
	called?: boolean;
	busy?: boolean;
	status?: number;
	url?: string;
	responseText?: string;
	responseJSON?: T;
	error?: string;
	get?: (url: string) => void;
}

export const useApi = (options?: { url: string }): IApiResult<any> => {
	const xhrRef = useRef(null);
	const [ result, setResult ] = useState<IApiResult<any>>(() => ({
		lastCall: 0,
		called: false
	}));

	const call = (url: string) => {
		xhrRef.current.open('GET', url);
		xhrRef.current.send(null);
		setResult({
			busy: true,
			lastCall: Date.now(),
            url: url,
            status: null,
            responseJSON: null,
            responseText: null
		});
	};

	useEffect(() => {
		xhrRef.current = new XMLHttpRequest();
		if (options) {
			call(options.url);
		}

		function parseJSON() {
            const firstChar = (xhrRef.current.responseText || ' ')[0];
            
			return (firstChar == '{' || firstChar == '[') ? JSON.parse(xhrRef.current.responseText) : null;
		}

		xhrRef.current.onreadystatechange = function() {
			const DONE = 4; // readyState 4 means the request is done.
			const OK = 200; // status 200 is a successful return.
			if (xhrRef.current.readyState === DONE) {
				if (xhrRef.current.status === OK) {
					setResult({
						busy: false,
						status: xhrRef.current.status,
						responseText: xhrRef.current.responseText,
						responseJSON: parseJSON()
					});
					//console.log(xhrRef.current.responseText); // 'This is the returned text.'
				} else {
					//console.log('Error: ' + xhrRef.current.status); // An error occurred during the request.
					setResult({
						busy: false,
						status: xhrRef.current.status,
						responseText: xhrRef.current.responseText,
						responseJSON: parseJSON()
					});
				}
			}
		};
		return () => {
			xhrRef.current.onreadystatechange = null;
			xhrRef.current = null;
		};
	}, []);
	return {
		...result,
		called: result.lastCall != 0,
		get: (url: string) => call(url)
	};
};

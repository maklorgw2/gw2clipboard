import { useEffect } from 'react';
import { useApi } from '@libs/useApi';
import { CURRENT_VERSION } from '@models/IConfig';
import { HostManager } from '@libs/HostManager';

export const useUpdateCheck = (onStart: boolean) => {
    const releasesUrl = "https://api.github.com/repos/maklorgw2/gw2clipboard/releases/latest";
    const autoCall = onStart && HostManager.getConfig().settings.CheckForUpdateOnStart;
	const api = useApi(autoCall ? { url: releasesUrl } : undefined);

    useEffect(() => {
		if (api.called && !api.busy) {
			if (api.responseJSON && api.status == 200) {
				const tag = api.responseJSON.tag_name;
                const link = api.responseJSON.assets[0].browser_download_url.substr(60);

				if (tag > CURRENT_VERSION) {
					if (confirm(`Version ${tag} is now available, do you wish to download this update?`)) {
						HostManager.downloadUpdate(link);
					}
				}
				else {
					if (!onStart)
						alert('There are no updates available');
				}
			}
			else {
				alert(`There was an error checking for updates (Error code:${api.status})`);
			}
		}
    }, [api.called, api.busy]);
    
	return {
		check: () => {
			api.get(releasesUrl);
        },
        busy: api.busy
	};
};

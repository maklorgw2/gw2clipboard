import React, { Fragment } from 'react';
import { HostManager } from '@libs/HostManager';
export const JSONConfig = () => {
	return (<Fragment>
		<pre contentEditable={true}>{JSON.stringify(HostManager.getConfig().categoryData, null, 2)}</pre>
	</Fragment>);
};

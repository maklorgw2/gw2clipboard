import React, { Fragment } from 'react';
import { HostManager } from '@libs/HostManager';
export const JSONConfig = (props: { selectElement: JSX.Element }) => {
	return (
		<Fragment>
			<div className="layout-header">{props.selectElement}</div>
			<div className="layout-detail">
				<pre contentEditable={true}>{JSON.stringify(HostManager.getConfig().categoryData, null, 2)}</pre>
			</div>
		</Fragment>
	);
};

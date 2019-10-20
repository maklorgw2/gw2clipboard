import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { BaseRouter } from '@components/BaseRouter';
import { StateProvider } from '@components/StateContext';
import { HostManager } from '@libs/HostManager';

HostManager.setClientReady(false);

ReactDOM.render(
	<StateProvider>
		<Router> 
			<BaseRouter />
		</Router>
	</StateProvider>,
	document.getElementById('appmount')
);

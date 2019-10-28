import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { BaseRouter } from '@components/BaseRouter';
import { StateProvider } from '@libs/StateContext';

ReactDOM.render(
	<StateProvider>
		<Router> 
			<BaseRouter />
		</Router>
	</StateProvider>,
	document.getElementById('appmount')
);

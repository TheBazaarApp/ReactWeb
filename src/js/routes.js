import React from 'react';
import { Router, Route } from 'react-router';

//Put import statements from every page here
import App from './App';

const Routes = (props) => (
	<Router history={props.hashHistory}>
		<Route path="/" component={App} />
	</Router>
	);

export default Routes;
 
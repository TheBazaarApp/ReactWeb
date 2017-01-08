import React from 'react';
import { Router, Route } from 'react-router';


//TODO: Is this file even needed?

//Put import statements from every page here
import App from './App';
import NewAlbum from './NewAlbum';

const Routes = (props) => (
	<Router history={props.hashHistory}>
		<Route path="/" component={App} />
		<Route path="/please" component={NewAlbum} />
	</Router>
	);

export default Routes;
 
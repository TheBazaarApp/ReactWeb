import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

//All Pages Here
import App from './js/App'
import About from './js/About'

ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={App} />
		<Route path="/about" component={About}/>
	</Router>
), document.getElementById('root'));

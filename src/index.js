import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

//All Pages Here
import App from './js/App'
import About from './js/About'
import NewAlbum from './js/NewAlbum'
import Closeup from './js/Closeup'


ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={App} />
		<Route path="/about" component={About}/>
		<Route path="/newAlbum" component={NewAlbum}/>
		<Route path="/closeup" component={Closeup}/>
	</Router>
), document.getElementById('root'));

//TODO: How to put useful info in the header

// npm install firebase --save
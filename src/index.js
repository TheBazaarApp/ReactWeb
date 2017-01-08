import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import * as firebase from 'firebase'

//All Pages Here
import App from './js/App'
import About from './js/About'
import NewAlbum from './js/NewAlbum'
import Closeup from './js/Closeup'
import Feed from './js/Feed'


// Start Firebase
var config = {
    apiKey: "AIzaSyAJ3zbY8WGd_yp4QieezawVo11oV_zb-QI",
    authDomain: "bubbleu-app.firebaseapp.com",
    databaseURL: "https://bubbleu-app.firebaseio.com",
    storageBucket: "bubbleu-app.appspot.com",
    messagingSenderId: "98205665216"
  };


firebase.initializeApp(config);


ReactDOM.render((
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<Route path="/about" component={About}/>
			<Route path="/newAlbum" component={NewAlbum}/>
			<Route path="/closeup" component={Closeup}/>
			<Route path="/feed" component={Feed}/>
		</Route>
	</Router>
), document.getElementById('root'));

//TODO: How to put useful info in the header

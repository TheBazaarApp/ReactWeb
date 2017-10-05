import React from 'react'
import ReactDOM from 'react-dom';
import App from './js/App';
import * as firebase from 'firebase'


//All Pages Here

//CURRENT STATUS
//	- connects to Firebase
//	- Sets up navigation to every page which has been created yet.
//	- This page is pretty solid - yay!



// Start Firebase
// Real database
// var config = {
//     apiKey: "AIzaSyAJ3zbY8WGd_yp4QieezawVo11oV_zb-QI",
//     authDomain: "bubbleu-app.firebaseapp.com",
//     databaseURL: "https://bubbleu-app.firebaseio.com",
//     storageBucket: "bubbleu-app.appspot.com",
//     messagingSenderId: "98205665216"
//   };

//Test database
var config = {
    apiKey: "AIzaSyAtz54bA1nfZt7Y6-LlU9qCyQkK9emm_AY",
    authDomain: "oliviatestbazaar.firebaseapp.com",
    databaseURL: "https://oliviatestbazaar.firebaseio.com",
    projectId: "oliviatestbazaar",
    storageBucket: "oliviatestbazaar.appspot.com",
    messagingSenderId: "321196074864"
  };

firebase.initializeApp(config);

ReactDOM.render(
	(<App />),
	document.getElementById('root')
); 

// ReactDOM.render((
// 	<Router history={browserHistory}>
// 		<Route path="/" component={App}>
// 			<Route path="/about" component={About} />
// 			<Route path="/newAlbum" component={NewAlbum} />
// 			<Route path="/closeup/:sellerCollege/:sellerID/:category/:itemID" component={Closeup} />
// 			<Route path="/profile/:college/:uid" component={Profile} />
// 			<Route path="/myItems/:college/:uid/:category" component={MyItems} />
// 			<Route path="/settings" component={Settings} />
// 			<Route path="/feed" component={Feed} />
// 			<Route path="/login" component={Login} />
// 		</Route>
// 	</Router>
// ), document.getElementById('root'));


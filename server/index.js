var express = require('express')
var admin = require("firebase-admin");
const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase');

const app = express()
app.listen(8000, () => console.log("IT'S WORKING!!!"));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// FOR REAL SITE //
// var serviceAccount = require("./nocommit/service-account.js");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://bubbleu-app.firebaseio.com/" //TODO: We should change the name from bubble-u to the real one
// });
// var config = {
//     apiKey: "AIzaSyAJ3zbY8WGd_yp4QieezawVo11oV_zb-QI",
//     authDomain: "bubbleu-app.firebaseapp.com",
//     databaseURL: "https://bubbleu-app.firebaseio.com",
//     projectId: "bubbleu-app",
//     storageBucket: "bubbleu-app.appspot.com",
//     messagingSenderId: "98205665216"
//   };
// firebase.initializeApp(config);


// FOR DEVELOPMENT //
var dbInfo = require('./nocommit/test-db-info.js');
var devServiceAccount = require("./nocommit/test-service-acct.js");
var something = admin.initializeApp({
  credential: admin.credential.cert(devServiceAccount),
  databaseURL: dbInfo.databaseURL 
});
firebase.initializeApp(dbInfo.config);



app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
});


  ///////////////////////////////////////
 ////// Chat-related functions  ////////
///////////////////////////////////////


app.post("/sendChatMessage", (req, res) => {
	console.log ("sendChatMessage");
})

  ///////////////////////////////////////
 ////// Album-related functions  ///////
///////////////////////////////////////

app.post("/createAlbum", (req, res) => {
	var reqData = req.body;
	var idToken = reqData.idToken;
	admin.auth().verifyIdToken(idToken).then(function(decodedToken) {

		//Useful values which will come back later
		const uid = decodedToken.uid;
		const college = reqData.college;
		const userName = reqData.userName;
		const albumID = reqData.albumID;
		const items = reqData.items;
		const location = reqData.location;
		const locationLat = reqData.locationLat;
		const locationLong = reqData.locationLong;
		const albumName = reqData.albumName;

		const timestamp = Date.now() * -1; //TODO: Why make it negative?

		//If we are editing an existing album, it will already have an albumKey
		const albumKey = (reqData.albumID) ? reqData.albumID : firebase.database().ref().child(college + "/user/" + uid + "/albums").push().key;
		
		//Object where all the stuff to be saved to the database will be stored
		let childUpdates = {};
		var imageKeys = [];

		//Save every item into the database
		for (let item of items) {

			//If we are editing an existing album, some items will already have an imageKey
			const imageKey = item.imageKey ? item.imageKey : firebase.database().ref().child(college + "/user/" + uid + "/unsoldItems").push().key;
			imageKeys.push(imageKey);

			sendKeywordNotifications(item);

			//Store item details in the database in multiple different places (by album, and just by image)
			const detailsUnderAlbums = {
				price: item.price,
				description: item.description,
				tag: item.tag,
				name: item.itemName,
				hasPic: (item.pic != null)
			}

			const detailsUnderItems = {
				price: item.price,
				description: item.description,
				tag: item.tag,
				sellerId: uid,
				sellerName: userName,
				timestamp: timestamp,
				name: item.itemName,
				albumName: albumName,
				albumKey: albumKey,
				locationLat: locationLat ? locationLat : null,
				locationLong: locationLong ? locationLong : null,
				location: location ? location : null,
				hasPic: (item.pic != null)
			}

			childUpdates[college + "/user/" + uid + "/albums/" + albumKey + "/unsoldItems/" + imageKey] = detailsUnderAlbums;
			childUpdates[college + "/albums/" + albumKey + "/unsoldItems/" + imageKey] = detailsUnderAlbums;
			childUpdates[college + "/user/" + uid + "/unsoldItems/" + imageKey] = detailsUnderItems;
		}

		//Store album details
		const albumDetailsUnderUser = {
			albumName: albumName,
			timestamp: timestamp,
			locationLat: locationLat ? locationLat : null,
			locationLong: locationLong ? locationLong : null,
			location: location ? location : null
		}

		const albumDetailsUnderCollege = {
			albumName: albumName,
			sellerID: uid,
			sellerName: userName,
			timestamp: timestamp,
			locationLat: locationLat ? locationLat : null,
			locationLong: locationLong ? locationLong : null,
			location: location ? location : null
		}

		childUpdates[college + "/user/" + uid + "/albums/" + albumKey + "/albumDetails"] = albumDetailsUnderUser;
		childUpdates[college + "/albums/" + albumKey + "/albumDetails"] = albumDetailsUnderCollege;
		
		firebase.database().ref().update(childUpdates);

		return res.send({result:'success', imageKeys:imageKeys})

		//TODO: Return a response
	});
});


function sendKeywordNotifications() {
	//TODO: WRITE THIS FUNCTION!
}



app.post("/editAlbum", (req, res) => {
	console.log ("editAlbum");
})

app.post("/deleteAlbum", (req, res) => {
	console.log ("deleteAlbum");
})

  ////////////////////////////////////////
 ////// Profile-related functions  //////
////////////////////////////////////////

app.post("/editProfile", (req, res) => {
	console.log ("editProfile");
})


  /////////////////////////////////////////
 ////// Settings-related functions  //////
/////////////////////////////////////////

app.post("/changeEmail", (req, res) => {
	console.log ("changeEmail");
})

app.post("/changePassword", (req, res) => {
	console.log ("changePassword");
})

app.post("/recoverPassword", (req, res) => {
	console.log ("recoverPassword");
})


  //////////////////////////////////////
 ////// Buy-related functions  ////////
//////////////////////////////////////



app.post("/getItemInfo", (req, res) => {
	console.log ("getting item info");

	var reqData = req.body;
	var idToken = reqData.idToken;
	admin.auth().verifyIdToken(idToken).then(function(decodedToken) {

		const imageRef = firebase.database().ref().child(reqData.sellerCollege + "/user/" + reqData.sellerID + "/" + reqData.category + "Items/" + reqData.itemID);
		console.log("ref: " + imageRef);
		imageRef.on('value', function(snapshot) {
			if (snapshot.val()) {
				console.log(snapshot.val());
				let newState = {};
				newState.itemName = snapshot.child("name").val();
				newState.tag = snapshot.child("tag").val();
				newState.description = snapshot.child("description").val();
				newState.sellerName = snapshot.child("sellerName").val();
				newState.location = snapshot.child("location").val();
				newState.locationLong = snapshot.child("locationLong").val();
				newState.locationLat = snapshot.child("locationLat").val();
				newState.albumKey = snapshot.child("albumKey").val();
				newState.isCancelled = snapshot.child("cancelled").val();
				newState.isMine = (reqData.sellerID === reqData.user.uid);
				console.log("IS MINE? " + newState.isMine);
				let price = snapshot.child("price").val();
				if (price === "-0.1134") { //TODO: Is this necessary?
					price = "0"
				}
				newState.price = price;

				//TODO: Do we need albumName?
				if (reqData.category === "sold") {
					newState.transactionCancelled = (snapshot.child("cancelled") != null);
					newState.buyerName = snapshot.child("buyerName").val();
					newState.buyerID = snapshot.child("buyerID").val();
				}

				return res.send({result:'success', newState: newState});

			} else { //Deal with cases where someone has bought/mobded the item
				return res.send({result:'failure', message: "No item data"});
			}
		}.bind(this));
	});
})

app.post("/buy", (req, res) => {
	console.log ("buy");
})

app.post("/buyerCancel", (req, res) => {
	console.log ("buyerCancel");
})

app.post("/sellerCancel", (req, res) => {
	console.log ("sellerCancel");
})

app.post("/restoreToFeed", (req, res) => {
	console.log ("restoreToFeed");
})

app.post("/deleteItem", (req, res) => {
	console.log ("deleteItem");
})


  ///////////////////////////////////////////////
 ////// Notification-related functions  ////////
///////////////////////////////////////////////

app.post("/sendNotification", (req, res) => {
	console.log ("sendNotification");
})
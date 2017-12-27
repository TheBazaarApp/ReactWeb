import React, { Component } from 'react'
import '../css/App.css'
import MenuBar from './MenuBar'
import * as firebase from 'firebase'
import { history } from 'react-router'
import { BrowserRouter, Route } from 'react-router-dom'
import $ from 'jquery';

import About from './About'
import NewAlbum from './NewAlbum'
import Closeup from './Closeup'
import Feed from './Feed'
import Profile from './Profile'
import MyItems from './MyItems'
import Settings from './Settings'
import Welcome from './Welcome'
import Chat from './Chat'

//TODO: Change database auth rules back!!


//CURRENT STATUS
//	- Puts a menubar on every page
//	- Gets albums from firebase
//	- Passes all data to EVERY child - not sure if that's a good idea
//	- Doesn't get user data yet
//	- Doesn't log you in yet




//Useful links:
//http://stackoverflow.com/questions/31862839/passing-props-to-react-router-children-routes
//http://stackoverflow.com/questions/35835670/react-router-and-this-props-children-how-to-pass-state-to-this-props-children

export default class App extends Component {

	//TODO: Later make it not just one automatic user or one default trading list
	constructor() {
		super();
		this.state = {
			albums: [], 
			user: firebase.auth().currentUser,
			tradingList: ["hmc_edu"],
			college: "hmc_edu",
			userName: "Olivia the Awesome"
		}//TODO: Don't hard-code this
		this.dealWithAuthState();
	}

	//Listen to colleges for items for the feed
	//TODO: Consider moving this to the feed
	componentDidMount() {
		if (this.state.user) {
			this.listenToColleges();
			this.listenToMyItems();
			this.getProfile();
		}
	}

		render() {
		return (
			<BrowserRouter history={history}>
				<div className="App">
					{this.state.user &&
					<div>
						<Route 	path="/"
								render={(props) => <MenuBar {...props} 
									college={this.state.college}
									uid={this.state.user.uid} />} />
						<Route 	path="/about"
								render={(props) => <About {...props} />} />
						<Route 	path="/newAlbum"
								render={(props) => <NewAlbum {...props}
									serverCall={this.serverCall}
									college={this.state.college}
									userName={this.state.userName}
									user={this.state.user} />} />
						<Route 	path="/closeup/:sellerCollege/:sellerID/:category/:itemID"
								render={(props) => <Closeup {...props}
									user={this.state.user}
									serverCall={this.serverCall}
									loggedIn={this.state.loggedIn} />} />
						<Route 	path="/profile/:college/:uid"
								render={(props) => <Profile {...props}
									serverCall={this.serverCall}
									collegeName={this.state.collegeName}
									rating={this.state.rating}
									count={this.state.count}
									user={this.state.user}/>} />
						<Route 	path="/myItems/:college/:uid/:category"
								render={(props) => <MyItems {...props}
									user={this.state.user}
									albums={this.state.albums}
									unsoldItems={this.state.unsoldItems}
									soldItems={this.state.soldItems}
									purchasedItems={this.state.purchasedItems}/>} />
						<Route 	path="/settings"
								render={(props) => <Settings {...props}
									user={this.state.user}/>} />
						<Route 	path="/feed"
								render={(props) => <Feed {...props}
									user={this.state.user}
									albums={this.state.albums} />} />
						
						<Route 	path="/chat"
								render={(props) => <Chat {...props}
									college={this.state.college}
									serverCall={this.serverCall}
									user={this.state.user} />} />
					</div>
					}
					<Route 	path="/welcome"
							render={(props) => <Welcome {...props}
								serverCall={this.serverCall}
								user={this.state.user}/>} />
				</div>
			</BrowserRouter>
		)
	}

	serverCall(data, funcName) {
		var url = "http://localhost:8000/";
		console.log('AS A STRING: ', JSON.stringify(data));
		return $.ajax({
			type: "POST",
			url: url + funcName,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			success: function(result) {
			} //TODO: Add a failure function too?
		});
	}

	dealWithAuthState() {
		firebase.auth().onAuthStateChanged(function(user) {
			this.setState({user: user});
			if (user) {
				this.listenToColleges();
				this.listenToMyItems();
				this.getProfile();
			}
		}.bind(this))
	}

	//////////////////////////////////////////////////////////////////////
	////////////                                                //////////
	////////////                FEED FUNCTIONS                  //////////
	////////////                                                //////////
	//////////////////////////////////////////////////////////////////////

	//Listen for items for sale from each college the user is following
	listenToColleges() {
		for (const college of this.state.tradingList) {
			const feedRef = firebase.database().ref().child(college + "/albums");
			this.createChildAddedListener_Feed(feedRef, college);
			this.createChildChangedListener_Feed(feedRef, college);
			this.createChildRemovedListener_Feed(feedRef);
		} 	
	}

	listenToMyItems() {
		this.createMyItemListener('unsoldItems')
		this.createMyItemListener('soldItems')
		this.createMyItemListener('purchasedItems')
	}

	createMyItemListener(category) {
		var dataRef = firebase.database().ref().child(this.state.user.college + "/user/" + this.state.user.uid + "/" + category)
		dataRef.on('value', function(snapshot) {
			var myItems = []
			for (var itemInfo in snapshot.val()) {
				myItems.push(this.createItem(snapshot.child(itemInfo)))
			}
			var dict = {}
			dict[category] = myItems
			this.setState(dict)
		}.bind(this));
	}



	createItem(itemInfo) {
		var newItem = {
			albumKey: itemInfo.child('albumKey').val(),
			albumName: itemInfo.child('albumName').val(),
			buyerCollege: itemInfo.child('buyerCollege').val(),
			buyerID: itemInfo.child('buyerID').val(),
			buyerName: itemInfo.child('buyerName').val(),
			description: itemInfo.child('description').val(),
			name: itemInfo.child('name').val(),
			price: itemInfo.child('price').val(),
			tag: itemInfo.child('tag').val(),
			timestamp: itemInfo.child('timestamp').val(),
			picture: 'cheetah.jpg', //TODO: take this out
		}
		return newItem
	}

	//TODO: Maybe hide image until it shows up
	createChildAddedListener_Feed(feedRef, college) {
		//const improveFeedRef = feedRef.queryOrderedByChild("albumDetails/timestamp");
		feedRef.on('child_added', function(snapshot) {
			let album = this.createAlbum(snapshot, college);
			this.insertAlbum(album);
		}.bind(this));
	}

	createChildChangedListener_Feed(feedRef, college) {
		feedRef.on('child_changed', function(snapshot) {
			let album = this.createAlbum(snapshot, college);
			this.updateAlbum(album);
		}.bind(this));
	}

	//Take in a snapshot and the college.Create and return an album object
	createAlbum(snapshot, college) { //TODO: For the moment, we're not counting to see if the album needs to be deleted
		//Album details
		var newAlbum = {
			unsoldItems: [],
			albumID: snapshot.key,
			albumName: snapshot.child('albumDetails/albumName').val(),
			sellerID: snapshot.child('albumDetails/sellerID').val(),
			sellerName: snapshot.child('albumDetails/sellerName').val(),
			sellerCollege: college,
			locationLat: snapshot.child('albumDetails/locationLat').val(), //TODO: Coult be problematic if these don't exist
			locationLong: snapshot.child('albumDetails/sellerName').val(),
			location: snapshot.child('albumDetails/location').val(),
			timestamp: snapshot.child('albumDetails/timestamp').val()
		};
		//Add Items to the album
		var itemList = snapshot.child('unsoldItems');
		itemList.forEach(function(itemInfo) {
			var newItem = {
				imageKey: itemInfo.key,
				description: itemInfo.child('description').val(),
				tag: itemInfo.child('tag').val(),
				name: itemInfo.child('name').val(),
				price: itemInfo.child('price').val(),
				picture: 'cheetah.jpg', //TODO: take this out
				hasPic: true //Default, ISOs may be exceptions to this
			}

			//Some ISOs don't have pics
			//TODO: Only have to do this once
			newAlbum.isISO = (newItem.tag === "In Search Of");
			if (newAlbum.isISO) {
				if (itemInfo.child('hasPic').val()) {
					newItem.hasPic = false;
				}
			}
			
			newAlbum.unsoldItems.push(newItem);
			if (newItem.hasPic) {
				this.getImage(newItem, newAlbum); //TODO: Would be more efficient if we only called this when needed
			}
		}.bind(this));
		return(newAlbum);
	}

	createChildRemovedListener_Feed(feedRef) {
		feedRef.on('child_removed', function(snapshot) {
			const deletedAlbumID = snapshot.key;
			let albums = this.state.albums;
			for (let i = albums.length - 1; i >= 0; i--) {
				if (albums[i].albumID === deletedAlbumID) {
					albums.splice(i, 1);
				}
			}
			this.updateState(albums);
		}.bind(this));
	}


	updateState(albums) {
		this.setState({
			albums: albums
		});
	}


	getImage(item, album) {
		const imageRef = firebase.storage().ref().child(album.sellerCollege + '/user/' + album.sellerID + '/images/' + item.imageKey);
		imageRef.getDownloadURL().then(function(url) {
			item.picture = url;
			this.updateAlbum(album);
		}.bind(this)).catch(function(error) {
			//TODO: Later on, make it repeat a few times if it isn't loading.
		});
	}

	//When an album has been change, update it in albums and save the changes to state
	updateAlbum(changedAlbum) {
		var albums = this.state.albums;
		var index = 0;
		for (var album of albums) {
			if (changedAlbum.albumID === album.albumID) {
				albums[index] = changedAlbum;
				break;
			}
			index++;
		}
		this.updateState(albums);
	}

	//Insert a new album to the albums array
	insertAlbum(newAlbum) {
		var inserted = false;
		var albums = this.state.albums;
		for (var i = 0; i < albums.length; i++) {
			const currAlbum = albums[i];
			if (currAlbum.timestamp > newAlbum.timestamp) {
				albums.splice(i, 0, newAlbum);
				inserted = true;
				break;
			}
		}
		if (!inserted) {
			albums.push(newAlbum);
		}
		this.updateState(albums);
	}	

	//////////////////////////////////////////////////////////////////////
	////////////                                                //////////
	////////////           PERSONAL INFO FUNCTIONS              //////////
	////////////                                                //////////
	//////////////////////////////////////////////////////////////////////

	getProfile() {
		const collegeRef = firebase.database().ref().child("users/" + this.state.user.uid);
		console.log("collegeRef", "users/" + this.state.user.uid)
		collegeRef.on('value', function(snapshot) {
			const college = snapshot.val();
			const profileRef = firebase.database().ref().child(college + '/user/' + this.state.user.uid + '/profile/')
			console.log("profileRef", college + '/user/' + this.state.user.uid + '/profile/');
			profileRef.on('value', function(snapshot) {
				console.log(snapshot.val())
				console.log(snapshot.child('name').val())
				//default lat, long, coords
				this.setState({
					//college: college, TODO: Make this work!
					collegeName: snapshot.child('collegeName').val(),
					name: snapshot.child('name').val(),
					rating: snapshot.child('rating').val(),
					count : snapshot.child('count').val(),
				})
			}.bind(this))
		}.bind(this));
	}
}



//NOW(olivia): Make it so the users fold of the database exists.




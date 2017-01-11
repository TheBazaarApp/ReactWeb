import React, { Component } from 'react'
import '../css/App.css'
import MenuBar from './Navbar'
import * as firebase from 'firebase'

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
		const user = {
			userName: "Olivia the Great",
			uid: "7BU605n3yDMci6fafU7iPIZUJhk1",
			college: "hmc_edu"
		}
		this.state = {
			albums: [], 
			user: user, //Null when not logged in //The current default is me (Olivia)
			tradingList: ["hmc_edu"]
		}
	}

	//Listen to colleges for items for the feed
	//TODO: Consider moving this to the feed
	componentDidMount() {
		this.listenToColleges();
	}


	render() {
		//Give all children certain properties (e.g. albums, current user);
		//TODO: Maybe only give each child what it needs, potentially through a switch statement
		var childrenWithProps = React.Children.map(this.props.children, function(child) {
					return React.cloneElement(child, {
						albums: this.state.albums,
						user: this.state.user
					});
				}.bind(this));
		return (
			<div className="App">
				<MenuBar />
				{childrenWithProps}
			</div>
		);
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
			this.createChildAddedListener(feedRef, college);
			this.createChildChangedListener(feedRef, college);
			this.createChildRemovedListener(feedRef);
		} 	
	}

	//TODO: Maybe hide image until it shows up
	createChildAddedListener(feedRef, college) {
		//const improveFeedRef = feedRef.queryOrderedByChild("albumDetails/timestamp");
		feedRef.on('child_added', function(snapshot) {
			let album = this.createAlbum(snapshot, college);
			this.insertAlbum(album);
		}.bind(this));
	}

	createChildChangedListener(feedRef, college) {
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

	createChildRemovedListener(feedRef) {
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
			//console.log("didn't get pic :(     " + error);
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

	// getUser(){
	// 	//TODO: Get rid of this function once login is implemented
		

	// }






	//default lat, long, coords
	//rating
	//rating count
	//name
	//email
	//colege

	//name


	//Plan of action: Do profile (basic), then AddewItem, then Closeup
	//At midnight, stop for TUTP, workout, and shower
	//Set alarm for phone call

}

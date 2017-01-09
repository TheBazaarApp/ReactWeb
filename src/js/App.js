import React, { Component } from 'react'
import '../css/App.css'
import { MenuBar } from './Navbar'
import * as firebase from 'firebase'

//http://stackoverflow.com/questions/31862839/passing-props-to-react-router-children-routes
//http://stackoverflow.com/questions/35835670/react-router-and-this-props-children-how-to-pass-state-to-this-props-children

class App extends Component {

	//TODO: Possibly use user rather than uid
	//TODO: Later make it not just one automatic user
	constructor() {
		super();
		//var user = {uid:"7BU605n3yDMci6fafU7iPIZUJhk1", college:"hmc_edu", email:"owatkins@g.hmc.edu"}; //TODO: Take this out //TODO: Better email
		this.state = {
			albums: [], 
			//user: user, //Null when not logged in //The current default is me (Olivia) //TODO: Possibly take this out
			tradingList: ["hmc_edu"], //TODO: don't make hmc a default
		}
	}


	//TODO: Look up whether these functions are better here or in the constructor
	//TODO: when you navigate away, does this disappear?
	componentDidMount() {
		this.listenToColleges();
	}


	render() {
		var childrenWithProps = React.Children.map(this.props.children, function(child) {
					return React.cloneElement(child, {
						albums: this.state.albums
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

export default App;

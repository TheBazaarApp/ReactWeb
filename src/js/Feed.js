import React, { Component } from 'react'
import '../css/App.css'
import { Button, Image, FormGroup, FormControl, DropdownButton, MenuItem, Carousel } from 'react-bootstrap'
import * as firebase from 'firebase'

export class Feed extends Component {


	test() {
		let albums = [{val: [1]}, {val:[2]}];
		let itemsToShow = albums.map(
			
				(album) => {
					return(
					album.val.map(
						(item) => {
							return(3);
						}
					)
					)
				}
			
		)
		console.log("test: " + itemsToShow);
	}


	//TODO: Possibly use user rather than uid
	//TODO: Later make it not just one automatic user
	constructor() {
		super();
		this.test();
		this.state = {
			albums: [],
			uid: "7BU605n3yDMci6fafU7iPIZUJhk1", //This is mine (Olivia's) //TODO: Possibly take this out
			user: null, //Null when not logged in
			tradingList: ["hmc_edu"], //TODO: don't make hmc a default
			filterBy: "All Albums"
			//TODO: A lot of stuff here
		}
		//Event handlers
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.filterByCategory = this.filterByCategory.bind(this);
	}

	//TODO: Look up whether these functions are better here or in the constructor
	//TODO: when you navigate away, does this disappear?
	componentDidMount() {
		this.listenToColleges();
	}


	render() {
		const filterCategories = ["All Albums", "All Items", "Fashion", "Electronics", "Appliances", "Transportation", "Furniture", "School Supplies", "Services", "Other"];
		let itemsToShow = null;
		if (this.state.filterBy === "All Albums") {
			itemsToShow = this.state.albums.map(
				(album) => {
					return( <Album key={album.albumID} album={album} />);
				})
		} else {
			itemsToShow = this.state.albums.map(
				(album, index) => {
					return(
					album.unsoldItems.filter(this.filterByCategory).map(
						(item, index) => {
							return( <Item key={item.imageKey} item={item} />);
						}
					))
				}
			)
		}

		return (
			<div className="wrapper ugh">
				<div className="side-by-side">
					<FormGroup>
						<FormControl 
							type="text"
							placeholder="Filter by keyword" />
					</FormGroup>
					<DropdownButton 
						id="categories" 
						title={this.state.filterBy}
						onSelect={(eventKey, event) => this.handleCategoryChange(eventKey)}>

						{filterCategories.map((category, index) => {
							return ( <MenuItem key={index} eventKey={category}>{category}</MenuItem> );
						})}
					</DropdownButton>
				</div>
				{itemsToShow}
			</div>
		)
	}



	filterByCategory(item) {
		const category = this.state.filterBy;
		return (category === "All Items" || item.tag === category);
	}




	handleCategoryChange(value) {
		this.setState({
			filterBy: value
		})
	}


	listenToColleges() {
		for (const college of this.state.tradingList) {
			const feedRef = firebase.database().ref().child(college + "/albums");
			this.createChildAddedListener(feedRef, college);
			//TODO: Add child changed listener here
			//TODO: Add child removed listener here
		} 	
	}


	createChildAddedListener(feedRef, college) {
		//const improveFeedRef = feedRef.queryOrderedByChild("albumDetails/timestamp");
		feedRef.on('child_added', function(snapshot) { //child_added
			if (snapshot) {
				if (snapshot.child('unsoldItems') != null) {
					//Album details
					//TODO: Do we need any of the indexes?
					//TODO: Make sure we handle null values sensibly
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
							timestamp: itemInfo.child('timestamp').val(),
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
							this.getImage(newItem, newAlbum); //TODO: Implement this
						}
						
					}.bind(this));
					this.insertAlbum(newAlbum);
					//TODO: Maybe have an "All Items" thing too
				}
			}
		}.bind(this));
	}


	getImage(item, album) {
		//const storageRef = FIRStorage.storage().referenceForURL("gs://bubbleu-app.appspot.com");
		const imageRef = firebase.storage().ref().child(album.sellerCollege + '/user/' + album.sellerID + '/images/' + item.imageKey);
		imageRef.getDownloadURL().then(function(url) {
			//Find item
			// Update its' state
			// TODO: Is this passed by val or by reference?
			item.picture = url;
			this.updateAlbum(album);
			//this.state.pic = 
		}.bind(this)).catch(function(error) {
			///console.log("didn't get pic :(     " + error);
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
		this.setState({
			albums: albums
		});
	}

	insertAlbum(newAlbum) {
		var inserted = false;
		var albums = this.state.albums;
		for (var i = 0; i < albums.length; i++) {
			const currAlbum = albums[i];
			//TODO: should timestamp be an individual or album-level property?
			if (currAlbum.unsoldItems[0].timestamp > newAlbum.unsoldItems[0].timestamp) {
				albums.splice(i, 0, newAlbum);
				inserted = true;
				break;
			}
		}
		if (!inserted) {
			albums.push(newAlbum);
		}
		this.setState({
			albums: albums
		});
	}


}

//


class Album extends Component {
	render() {
		return (
			<div>
				<Button>
					<Carousel className="small center">
						{this.props.album.unsoldItems.map((item) => {
							return ( 
								<Carousel.Item key={item.imageKey}>
									<Image className="small" src={item.picture} />
								</Carousel.Item>
							);
						})}
					</Carousel>
				</Button>
				<PriceSticker price={this.props.price} />
			</div>
		)
	}
} 
 



class Item extends Component {
	render() {
		return (
			<div>
				<Button>
					<Image  className="small" src={this.props.item.picture} thumbnail />
				</Button>
				<PriceSticker price={"$" + this.props.item.price} />
				{/*TODO: format price better*/}
			</div>
		)
	}
}




class PriceSticker extends Component {
	render() {
		return (
			<div className="bluesticker">
				{this.props.price}
			</div>
		)
	}
}






export default Feed;



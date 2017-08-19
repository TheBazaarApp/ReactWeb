import React, { Component } from 'react'
import '../css/App.css'
import { Link } from 'react-router'
import { Image, Button, Modal } from 'react-bootstrap'
import * as firebase from 'firebase'
import { browserHistory } from 'react-router'


//CURRENT STATUS
//	- Displays normal profile info okay
//	- Doesn't deal with any events (e.g. buying it)
//	- Doesn't deal with already sold case (when this is soldItems, purchasedItems, sellerRejected, etc.)
//	- Gets database info in a very sketchy way
//	- Formatting :(


export default class Closeup extends Component {

	constructor() {
		super();
		this.state = {
			itemName: "",
			tag: "",
			description: "",
			sellerName: "",
			location: "",
			locationLong: "",
			locationLat: "",
			albumKey: "",
			price: ""
		}

		this.closePopups = this.closePopups.bind(this);
		this.buyItem = this.buyItem.bind(this);
	}

	//http://localhost:3000/closeup/hmc_edu/7BU605n3yDMci6fafU7iPIZUJhk1/unsold/-Ka9OZYpkLJnyg5dzKmx

	componentDidMount() {
		this.getItemInfo();
		this.getImage(); //TODO: What about ISOs that don't have one?
	}


	render() {
		//const itemData = this.getItem();
		if (this.state.showGonePopup) {
			return(	
				<div>
				{/*Popup when some required fields are missing.*/}
					<Modal show={true} >
						<Modal.Body>
							This item has been bought, moved, or deleted.  Sorry!
						</Modal.Body>
					</Modal>
				</div>
			)
		}

		return (
			<div>
				<Image className="newPic" src={this.state.pic} />
				<br/>
				<div className="center">
					<table className="center" cellpadding="0" cellspacing="0">
						<tbody>
							<tr className="closeup-table-row">
								<td>Item:</td>
								<td>{this.state.itemName}</td>
							</tr>
							<tr className="closeup-table-row">
								<td>Price:</td>
								<td>{this.state.price}</td>
							</tr>
							<tr className="closeup-table-row">
								<td>Seller:</td>
								<td>
									<Link to={'/profile/' + this.props.params.sellerCollege + "/" + this.props.params.sellerID}>{this.state.sellerName}</Link>
								</td>
							</tr>
						</tbody>
					</table>
					PUT LOCATION HERE
				</div>
				<div className="small-width center" >
					{ (this.props.params.category === "unsold") && <Button disabled={!this.state.isMine} block onClick={this.showBuyerPopup} >Buy</Button> }
					{ (this.props.params.category === "sold" && !this.state.isCancelled) && <Button block onClick={this.showCancelledPopup} >Cancel Transaction</Button> }
					{ (this.props.params.category === "purchased" && !this.state.isCancelled) && <Button block onClick={this.showCancelledPopup} >Cancel Transaction</Button> }
					{ (this.props.params.category === "sold" && this.state.isCancelled) && <Button block onClick={this.showFeedPopup} >Restore to Feed</Button> }
					{ (this.props.params.category === "sold" && this.state.isCancelled) && <Button block onClick={this.showDeletePopup} >Delete Forever</Button> }
				</div>
			{/*Popup when a user clicks 'BUY'.*/}
				<Popup 
					showCondition={this.state.showBuyerPopup}
					yesText="Buy"
					yesAction={this.buyItem}
					closeAction={this.closePopups}
					title="Are you sure?"
					body="Buying this item takes it off the feed."
				/>

			{/*Popup when someone clicks 'Cancel Transaction'.*/}
				<Popup 
					showCondition={this.state.showCancelPopup}
					yesText="Cancel Transaction"
					yesAction={this.category ==="sold" ? this.sellerCancelledTransaction : this.buyerCancelledTransaction}
					closeAction={this.closePopups}
					title="Are you sure you want to cancel transaction?"
					body="This action cannot be undone."
				/>

			{/*Popup when the seller clicks 'Restore to Feed.*/}
				<Popup 
					showCondition={this.state.showRestorePopup}
					yesText="Restore"
					yesAction={this.clickedBackToFeed}
					closeAction={this.closePopups}
					title="Are you sure you want to restore this item to the feed?"
				/>

			{/*Popup when the seller clicks 'Delete forever.'*/}
				<Popup 
					showCondition={this.state.showDeletePopup}
					yesText="Delete Forever"
					yesAction={this.deleteForever}
					closeAction={this.closePopups}
					title="Are you sure you want to delete this item forever?"
					body="This action cannot be undone."
				/>


				


			</div>
		)
	}

	showBuyerPopup() {
		this.setState({showBuyerPopup:true});
	}

	showCancelledPopup() {
		this.setState({showCancelPopup:true});
	}

	showRestorePopup() {
		this.setState({showRestorePopup:true});
	}

	showDeletePopup() {
		this.setState({showDeletePopup:true});
	}

	buyItem() {
		this.buyInDatabase();
		this.exchangeColleeges();
		//TODO: Category = purchased
		//TODO: Message Seller
		//TODO: Go to action
	}

	sellerCancelledTransaction() {

	}

	buyerCancelledTransaction() {
		
	}

	clickedBackToFeed() {
		//TODO: Show popup first
		this.restoreToFeed();
		//TODO: Test This!
		//Refresh the page, now with a new category
		const path = "/closeup/" + this.props.params.sellerCollege + "/" + this.props.params.sellerID + "/unsold/" + this.props.params.itemID;
		browserHistory.push(path);
	}

	deleteForever() {

	}


	closePopups() {
		this.setState({
			showGonePopup: false,
			showBuyerPopup: false
		})
	}


	getItemInfo() {
		const imageRef = firebase.database().ref().child(this.props.params.sellerCollege + "/user/" + this.props.params.sellerID + "/" + this.props.params.category + "Items/" + this.props.params.itemID);
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
				newState.isMine = (this.props.params.sellerID === this.props.user.uid);
				console.log("IS MINE? " + newState.isMine);
				let price = snapshot.child("price").val();
				if (price === "-0.1134") { //TODO: Is this necessary?
					price = "0"
				}
				newState.price = price;

				//TODO: Do we need albumName?
				if (this.props.params.category === "sold") {
					newState.transactionCancelled = (snapshot.child("cancelled") != null);
					newState.buyerName = snapshot.child("buyerName").val();
					newState.buyerID = snapshot.child("buyerID").val();
				}

				this.setState(newState);

			} else { //Deal with cases where someone has bought/mobded the item
				this.setState({
					showGonePopup: true
				});
			}
		}.bind(this));
	}

	getImage(item, album) {
		const imageRef = firebase.storage().ref().child(this.props.params.sellerCollege + '/user/' + this.props.params.sellerID + '/images/' + this.props.params.itemID);
		imageRef.getDownloadURL().then(function(url) {
			this.setState({
				pic: url
			})
		}.bind(this)).catch(function(error) {
			console.log("no pic");
			//TODO: Later on, make it repeat a few times if it isn't loading.
		});
	}

	buyInDatabase() {
		// console.log("changing in database!!!")
		// const sellerCollege = this.props.params.sellerCollege;
		// const sellerUID = this.props.params.sellerID;
		// const itemID = this.props.params.itemID;
		// const albumID = this.state.albumID;
		// const buyerCollege = this.props.user.college;
		// const buyerUID = this.props.uiser.uid;


		// let pathToUserUnsoldItems = sellerCollege + "/user/" + sellerUID + "/unsoldItems/" + itemID;
		// let pathToUserAlbums = sellerCollege + "/user/" + sellerUID + "/albums/" + albumID + "/unsoldItems/" + itemID;
		// let pathToCollegeAlbums = sellerCollege + "/albums/" + albumID + "/unsoldItems/" + itemID;
		// let pathToUserSoldItems = sellerCollege + "/user/" + sellerUID + "/soldItems/" + itemID;
		// let pathToUserBoughtItems = buyerCollege + "/user/" + buyerUID + "/purchasedItems/" + itemID;
		// let key = firebase.database().ref().child(sellerCollege + "/user/" + sellerUID + "/notifications").push().key
		// let pathToNotification = sellerCollege + "/user/" + sellerUID + "/notifications/" + key;

		// //TODO: Put notification in here!!!

		// let itemInfo = firebase.database().ref().child(sellerCollege + "/user/" + sellerUID + "/unsoldItems/" + itemID);
		// itemInfo.once('child_added', function(snapshot) {
		// 	const timestamp = Date.now() * -1;

		// 	// Get rid of sellerId
		// 	let notificationData = {
		// 		name: this.state.itemName,
		// 		tag: this.state.tag,
		// 		description: this.state.description,
		// 		sellerId: this.state.sellerId,
		// 		sellerName: this.state.sellerName,
		// 		location: this.state.location,
		// 		locationLong: this.state.locationLong,
		// 		locationLat: this.state.locationLat,
		// 		albumKey: this.state.albumKey,
		// 		price: this.state.price,
		// 		cancelled: this.state.isCancelled
		// 	}

		// 	let soldData = {
		// 		name: this.state.itemName,
		// 		tag: this.state.tag,
		// 		description: this.state.description,
		// 		sellerId: this.state.sellerId,
		// 		location: this.state.location,
		// 		locationLong: this.state.locationLong,
		// 		locationLat: this.state.locationLat,
		// 		albumKey: this.state.albumKey,
		// 		price: this.state.price,
		// 		cancelled: this.state.isCancelled,
		// 		buyerID: this.state.uid,
		// 		buyerName: this.state.displayName,
		// 		buyerCollege: this.state.myCollege,
		// 	}

		// 	let boughtData = {
		// 		name: this.state.itemName,
		// 		tag: this.state.tag,
		// 		description: this.state.description,
		// 		sellerId: this.state.sellerId,
		// 		sellerName: this.state.sellerName,
		// 		location: this.state.location,
		// 		locationLong: this.state.locationLong,
		// 		locationLat: this.state.locationLat,
		// 		albumKey: this.state.albumKey,
		// 		price: this.state.price,
		// 		cancelled: this.state.isCancelled,
		// 		timestamp: new Date().getTime(),
		// 		sellerCollege: this.state.sellerCollege,
		// 	} 


		// 		//TODO: Do we need albumName?
		// 		if (this.props.params.category === "sold") {
		// 			newState.transactionCancelled = (snapshot.child("cancelled") != null);
		// 			newState.buyerName = snapshot.child("buyerName").val();
		// 			newState.buyerID = snapshot.child("buyerID").val();
		// 		}


		// 	let childUpdates = {
		// 		pathToUserUnsoldItems: null, //
		// 		pathToUserAlbums: null, //
		// 		pathToCollegeAlbums: null, //
		// 		pathToUserSoldItems: soldData,
		// 		pathToUserBoughtItems: boughtData,
		// 		pathToNotification: notificationData,
		// 	}

		// 	firebase.database().ref().update(childUpdates);

		// })
        
	}



}



class Popup extends Component {
	render() {
		return (
			<Modal show={this.props.showCondition} onHide={this.props.closeAction}>
				<Modal.Header>
					<Modal.Title>{this.props.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.body}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.closeAction}>Close</Button>
					{this.props.yesText && <Button onClick={this.props.yesAction} bsStyle="primary">{this.props.yesText}</Button>}
				</Modal.Footer>
			</Modal>
		)
	}
}
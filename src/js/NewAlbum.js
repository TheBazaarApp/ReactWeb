import React, { Component } from 'react'
import '../css/App.css'
import { Image, Button, Modal, Checkbox, FormGroup, FormControl, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap'
import { MdCancel, MdAddCircle } from 'react-icons/lib/md'
import * as firebase from 'firebase'
import NumericInput from 'react-numeric-input'


export default class NewAlbum extends Component {

	constructor() {
		super();
		this.state = {
			items: [{itemName: "", price:"", tag: "None", description:"", pic:null}],
			albumName: "",
			isISO: false
			//Lots of other values which will appear in state (e.g. whether popups are open) start as default null
		}
		this.addNewItem = this.addNewItem.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleTagChange = this.handleTagChange.bind(this);
		this.handlePicChange = this.handlePicChange.bind(this);
		this.handlePriceChange = this.handlePriceChange.bind(this);
		this.handleAlbumChange = this.handleAlbumChange.bind(this);
		this.removePic = this.removePic.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.updateTagAll = this.updateTagAll.bind(this);
		this.closePopups = this.closePopups.bind(this);
		this.addNewAlbum = this.addNewAlbum.bind(this);
	}


	render() {
		return (
			<div>
				<h1>Add New Album</h1>
				<div>
					{/*Album Details*/}
					<FormGroup validationState={(this.state.highlighted && this.state.albumName === "") ? 'error' : null }>
						<ControlLabel>Album Name:</ControlLabel>
						<FormControl type="text" className="album-name" onChange={this.handleAlbumChange} />
					</FormGroup>
					<FormGroup>
						<ControlLabel>Tag All:</ControlLabel>
						<TagDropdown 
							tagAll={this.state.isISO ? "In Search Of" : this.state.tagAll} 
							updateTagAll={this.updateTagAll}/>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Location:</ControlLabel>
						<Button>None</Button>
					</FormGroup>
					<Checkbox onChange={(event) => this.toggleISO(event.target.checked)}>ISO (in search of) album</Checkbox>
					
					{/*Growing List of Items*/}
					<div id="new-item-box" className="center curve-corner our-blue">
						{this.state.items.map(
							(item, index) => {
								return(
									<NewItem 
										key={index} 
										index={index} 
										item={item} 
										handleNameChange={this.handleNameChange}
										handleDescriptionChange={this.handleDescriptionChange} 
										handleTagChange={this.handleTagChange}
										handlePicChange={this.handlePicChange}
										handlePriceChange={this.handlePriceChange}
										removePic={this.removePic}
										removeItem={this.removeItem}
										isISO={this.state.isISO}
									/>)
							})
						}
						<button className="center add-button" onClick={this.addNewItem}><MdAddCircle size={40}/></button>
					</div>
					<br/>
					<Button bsSize="large" className="create-button" onClick={this.addNewAlbum}>Create Album</Button>
				</div>

				{/*Popup when you try to change a tag while Tag All is selected.*/}
				<Modal show={this.state.showTagAllPopup} onHide={this.closePopups}>
					<Modal.Body>
						To change the tag of an individual item, set "Tag All" to "None".
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closePopups}>Close</Button>
					</Modal.Footer>
				</Modal>


				{/*Popup when some required fields are missing.*/}
				<Modal show={this.state.showMissingFieldsPopup} onHide={this.closePopups}>
					<Modal.Body>
						Some required fields are unfilled.  The missing fields are highlighted in red.
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closePopups}>Close</Button>
					</Modal.Footer>
				</Modal>


			</div>
		)
	}


	//Updates state to reflect whether or not the isISO checkbox is checked
	toggleISO(checked) {
		this.setState({
			isISO: checked
		})
	}

	//Updates state to show that an item's name is changed
	handleNameChange(newName, index) {
		if (newName.length <= 40) {
			let items = this.state.items;
			items[index].itemName = newName;
			this.setState({
				items: items
			});
		}
	}

	//TODO: If there isn't anything to modify here, create a helper function to deal with all of these
	//Updates state to show that an item's description is changed
	handleDescriptionChange(newDescription, index) {
		let items = this.state.items;
		items[index].description = newDescription;
		this.setState({
			items: items
		})
	}

	//TODO: Ensure price is in the correct format
	//Updates state to show that an item's price is changed
	handlePriceChange(newPrice, index) {
		
		let items = this.state.items;
		items[index].price = newPrice;
		// if (!isNaN(parseFloat(newPrice))) {
		// 	items[index].price = parseFloat(newPrice).toFixed(2);
		// }

		this.setState({
			items: items
		})
	}

	//Updates state to show that an item's tag is changed
	handleTagChange(newTag, index) {
		if (!this.state.tagAll) { //If no tag all selection
			let items = this.state.items;
			items[index].tag = newTag;
			this.setState({
				items: items
			})
		} else {
			if (!this.state.isISO) {
				this.setState({
					showTagAllPopup: true
				})
			}
		}
	}

	//Updates state to show that an item's pic is changed
	handlePicChange(files, index) {
		if(files && files[0]) { //Make sure we actually got something //TODO: Is this necesary?
			var reader = new FileReader();
			reader.onload = (event) => {
				let items = this.state.items;
				items[index].pic = event.target.result;
				items[index].file = files[0];
				this.setState({
					items: items
				})
			}
			reader.readAsDataURL(files[0]);
		}
	}

	//Updates state to show that the album name is changed
	handleAlbumChange(event) {
		this.setState({
			albumName: event.target.value
		});
	}

	//When you add a new item, update state with a new item with default values
	addNewItem() {
		const newItem = {itemName: "", tag: "None", description:"", price:"", pic:""};
		this.setState((prevState, props) => ({
			items: prevState.items.concat(newItem)
		}))
	}

	//Remove an item's pic
	removePic(index) {
		let items = this.state.items;
		items[index].pic = null;
		this.setState({
			items: items
		})
	}

	//Remove an item
	removeItem(index) {
		let items = this.state.items;
		if (items.length > 1) {
			items.splice(index, 1);
			this.setState({
				items: items
			})
		}
	}

	//Update state when the tag all field gets changed
	updateTagAll(value) {
		let items = this.state.items;
		for (let i = 0; i < items.length; i++) {
			items[i].tag = value;
		}
		this.setState({
			tagAll: value,
			items: items
		})
	}

	//Close whatever popups are open
	closePopups() {
		this.setState({
			showTagAllPopup: false,
			showMissingFieldsPopup: false
		})
	}


	//Save a new album and all of the items in it to our database
	addNewAlbum() {;
		//If fields aren't valid, we can't save yet
		if (this.checkValidityProblems()) {
			return;
		}

		//Useful values which will come back later
		const college = this.props.user.college;
		const uid = this.props.user.uid;
		const userName = this.props.user.userName;

		const timestamp = Date.now() * -1; //TODO: Why make it negative?

		//If we are editing an existing album, it will already have an albumKey
		const albumKey = (this.props.albumID) ? this.props.albumID : firebase.database().ref().child(college + "/user/" + uid + "/albums").push().key;
		
		//Object where all the stuff to be saved to the database will be stored
		let childUpdates = {};

		//Save every item into the database
		for (let item of this.state.items) {

			//If we are editing an existing album, some items will already have an imageKey
			const imageKey = item.imageKey ? item.imageKey : firebase.database().ref().child(college + "/user/" + uid + "/unsoldItems").push().key;
		

			if(item.pic) {
				console.log("saving pic")
				this.savePic(college, uid, imageKey, item.file);
			}

			this.sendKeywordNotifications(item);

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
				albumName: this.state.albumName,
				albumKey: albumKey,
				locationLat: this.state.locationLat ? this.state.locationLat : null,
				locationLong: this.state.locationLong ? this.state.locationLong : null,
				location: this.state.location ? this.state.location : null,
				hasPic: (item.pic != null)
			}

			childUpdates[college + "/user/" + uid + "/albums/" + albumKey + "/unsoldItems/" + imageKey] = detailsUnderAlbums;
			childUpdates[college + "/albums/" + albumKey + "/unsoldItems/" + imageKey] = detailsUnderAlbums;
			childUpdates[college + "/user/" + uid + "/unsoldItems/" + imageKey] = detailsUnderItems;
			
		}

		//Store album details
		const albumDetailsUnderUser = {
			albumName: this.state.albumName,
			timestamp: timestamp,
			locationLat: this.state.locationLat ? this.state.locationLat : null,
			locationLong: this.state.locationLong ? this.state.locationLong : null,
			location: this.state.location ? this.state.location : null
		}

		const albumDetailsUnderCollege = {
			albumName: this.state.albumName,
			sellerID: uid,
			sellerName: userName,
			timestamp: timestamp,
			locationLat: this.state.locationLat ? this.state.locationLat : null,
			locationLong: this.state.locationLong ? this.state.locationLong : null,
			location: this.state.location ? this.state.location : null
		}

		childUpdates[college + "/user/" + uid + "/albums/" + albumKey + "/albumDetails"] = albumDetailsUnderUser;
		childUpdates[college + "/albums/" + albumKey + "/albumDetails"] = albumDetailsUnderCollege;
		
		firebase.database().ref().update(childUpdates);
		console.log("about to go to feed");
		//Once it's saved, get bumped back to the feed (or maybe to a 'Success' page) //TODO: Discuss success page
		this.goToFeed();
	} //TODO: deal with errors in updating.


	//Navigate to feed
	goToFeed(imageKey) {
		const path = "/feed";
		this.props.history.push(path);
	}

	//Save an image to firebase storage
	savePic(college, uid, imageKey, pic) {
		const storageRef = firebase.storage().ref().child(college + "/user/" + uid + "/images/" + imageKey);
		storageRef.put(pic).then(function(snapshot) {
		}).catch(function(error) {
			console.log("pic upload failed" + error);
		});
	}

	sendKeywordNotifications(item) {
		//TODO: Do this
	}


	//Make sure the required fields are filled
	//		- All albums need names
	//		- All items need names
	//		- All ISO items need descriptions
	//		- All non-ISO items need prices and pictures
	checkValidityProblems() {
		//Check whether there are any unnamed items or items without prices
		let problems = false;
		if(this.state.albumName === "") {
			problems = true;
		}
		for (let item of this.state.items) {
			if(item.itemName === "" || (this.state.isISO && item.description === "") || (!this.state.isISO && (item.price === "" || item.pic === null)) ) {
				problems = true;
			}
		}
		if (problems) {
			let items = this.state.items;
			for (let i = 0; i < items.length; i++) {
				items[i].highlighted = true;
			}
			this.setState({
				showMissingFieldsPopup: true,
				highlighted: true,
				items: items
			})
		}
		return(problems);
	}
}






class NewItem extends Component {

	constructor() {
		super();
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleTagChange = this.handleTagChange.bind(this);
		this.handlePicChange = this.handlePicChange.bind(this);
		this.handlePriceChange = this.handlePriceChange.bind(this);
		this.removePic = this.removePic.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	render() {
		const filterCategories = ["None", "Fashion", "Electronics", "Appliances", "Transportation", "Furniture", "School Supplies", "Services"];
		let item = this.props.item;

		//Only show the X button on items which have pics
		let cancelButton = null;
		if (item.pic) {
			cancelButton = <button className="flat-button"onClick={this.removePic}><MdCancel /></button>
		}

		return (
			<div className="white newItem curve-corner">
				<div className="ten-padding flex-parent">
					<div className="inline flex five-padding">
					{/*Item Name*/}
						<FormGroup validationState={(item.highlighted && item.itemName === "") ? 'error' : null}> 
							<ControlLabel>Item Name:</ControlLabel>
							<FormControl type="text" onChange={this.handleNameChange} value={item.itemName} />
						</FormGroup>
					{/*Tag */}
						<FormGroup>
							<ControlLabel>Tag:</ControlLabel>
						{/*Code below doesn't do exactly what I wanted, but oh well (currently, it defaults to "None" when ISO clicked)*/}
							<FormControl 
								readOnly={this.props.isISO}
								componentClass="select" value={this.props.isISO ? "In Search Of" : item.tag}
								onChange={this.handleTagChange}>
								{filterCategories.map((category, index) => {
									return ( <option key={index} value={category}>{category}</option> );
								})}	
							</FormControl>
						</FormGroup>
						<FormGroup validationState={(item.highlighted && item.itemName === "") ? 'error' : null}> 
							<ControlLabel>Item Name:</ControlLabel>
							<NumericInput precision={2} value={item.price} onChange={this.handlePriceChange}/> 
						</FormGroup>
					{/*Decription*/}
						<FormGroup validationState={(item.highlighted && this.props.isISO && item.description === "") ? 'error' : null}>
							<ControlLabel>Description:</ControlLabel>
							<FormControl className="vertical-only" componentClass="textarea" onChange={this.handleDescriptionChange} value={item.description}/>
						</FormGroup>
					</div>
				{/*Picture*/}
					<FormGroup className="inline newPicButton five-padding" validationState={(item.highlighted && !this.props.isISO && item.pic === null) ? 'error' : null} >
						<Image className="newPic" src={item.pic} /> {/*Why doesn't Image work here?*/}
						<FormControl 
							type="file" accept="image/*" onChange={this.handlePicChange} />
						{cancelButton}
					</FormGroup>
				</div>
			{/*X-button*/}
			<div className="block">
				<button className="flat-button" onClick={this.removeItem}><MdCancel size={40}/></button>
			</div>
		</div>
		)
	}

	invalidPrice(price) {
		return price || this.props.isISO;
		// if (isNaN(parseFloat(price))) {
		// 	return false;
		// }
	}

	//TODO: Is there a more efficient way to deal with these?
	handleNameChange(event) {
		this.props.handleNameChange(event.target.value, this.props.index);
	}

	handleDescriptionChange(event) {
		this.props.handleDescriptionChange(event.target.value, this.props.index);
	}

	handleTagChange(event) {
		this.props.handleTagChange(event.target.value, this.props.index);
	}

	handlePicChange(event) {
		this.props.handlePicChange(event.target.files, this.props.index);
	}

	handlePriceChange(value) {
		this.props.handlePriceChange(value, this.props.index);
	}

	removePic() {
		this.props.removePic(this.props.index);
	}

	removeItem() {
		this.props.removeItem(this.props.index);
	}

	// TODO: formate price right
	// hi() {

	// }

	// textField(text) {
	// 	if textField.text == "" {
	// 		if replacementString == "$" {
	// 			return true
	// 		} else {
	// 			if replacementString == numberFiltered {
	// 				textField.text = "$"
	// 				newString = "$" + (newString as String)
					
	// 			}
	// 		}
	// 	}
			
			
	// 		//Don't let the user delete the $
			
	// 		if newString == ("$" as NSString) {
	// 			textField.text = ""
	// 		} else {
	// 			if !newString.containsString("$") && newString != ("" as NSString){
	// 				return false
	// 			}
	// 		}
			
	// 		if textField.text!.containsString(".") {
	// 			if replacementString.containsString(".") { //Return false if the user is trying to type two decimals
	// 				return false
	// 			}
	// 			let newDecimalArray = newString.componentsSeparatedByString(".")
	// 			if newDecimalArray.count == 2 {
	// 			let decimals = newDecimalArray[newDecimalArray.count - 1]
	// 			if decimals.characters.count > 2 { // don't let the user add 3+ decimal places
	// 				return false
	// 			}
	// 			}
	// 		}
	// 		if textField.text == "$" && newString == "$." { //If the user tries to write $., add in a zero: $0.
	// 			textField.text = "$0"
	// 		}
			
			
	// 		let maxLength = 6
	// 		return replacementString == numberFiltered && newString.length <= maxLength
	// 	}
	// 	if textField == tagField {
	// 		return false
	// 	}
	// 	if textField == itemName {
	// 		let maxLength = 50
	// 		let currentString: NSString = itemName.text!
	// 		let newString: NSString = currentString.stringByReplacingCharactersInRange(range, withString: replacementString)
	// 		itemNameChanged(textField)
	// 		return newString.length <= maxLength
	// 	}
	// 	return true
	// }


}




//TagDropdown - provides a dropwown list of all of the tag categories
class TagDropdown extends Component {

	render() {
		const filterCategories = ["Fashion", "Electronics", "Appliances", "Transportation", "Furniture", "School Supplies", "Services"];

		return (
			<DropdownButton id="tag" title={(this.props.tagAll) ? this.props.tagAll : "Category"}>
				<MenuItem key="-1"  onSelect={this.props.updateTagAll}>None</MenuItem>
				{filterCategories.map((category, index) => {
					return ( <MenuItem key={index} eventKey={category} onSelect={this.props.updateTagAll}>{category}</MenuItem> );
				})}
			</DropdownButton>
		)
	}
}
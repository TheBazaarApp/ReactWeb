import React, { Component } from 'react'
import '../css/App.css'
import { FormGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap'
import Album from './Album'
import Item from './Item'


//CURRENT STATUS
//		- Displays all items based on your list of colleges to trade with (although currently this is hard-coded)
//		- Lets you filter by keyword and category, as well as AlbumView/ItemView
//		- Lets you click through to Closeup
//		- UI.  Lol.  It could use work.

export default class Feed extends Component {

	constructor() {
		super();
		this.state = {
			filterBy: "All Albums"
		}
		//Event handlers
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.filterByCategory = this.filterByCategory.bind(this);
	}

	render() {
		//alert(this.props.history)
		const filterCategories = ["All Albums", "All Items", "Fashion", "Electronics", "Appliances", "Transportation", "Furniture", "School Supplies", "Services", "Other"];
		
		// Either show albums or items depending on what the user has selected
		let itemsToShow = null;
		if (this.state.filterBy === "All Albums") {
			itemsToShow = this.props.albums.map(
				(album) => {
					return( <Album 
						key={album.albumID} 
						album={album} 
						activeIndex={0} 
						showPrice={true}
						onClick={this.goToCloseup.bind(this)} />);
				})
		} else {
			itemsToShow = this.props.albums.map(
				(album, index) => {
					return(
					album.unsoldItems.filter(this.filterAll.bind(this)).map(
						(item, index) => {
							return( <Item 
								key={item.imageKey} 
								item={item} 
								onClick={this.goToCloseup.bind(this)} 
								sellerCollege={album.sellerCollege}
								sellerID={album.sellerID}
								showPrice={true}
								user={this.props.user}/>
							);
						}
					))
				}
			)
		}

		return (
			<div>
				<div className="side-by-side">
					{/* Filter/Category Options */}
					<FormGroup>
						<FormControl type="text" placeholder="Filter by keyword" onChange={(e) => this.handleFilterTextChange(e.target.value)} />
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
			{/*All of the items/albums are here. */}
				{itemsToShow}
			</div>
		)
	}


	filterAll(item) {
		return this.filterByCategory(item) && this.filterByKeyword(item);
	}

	filterByCategory(item) {
		const category = this.state.filterBy;
		return (category === "All Items" || item.tag === category);
	}

	filterByKeyword(item) {
		// Can filter by name, price, description, tag
		const keyword = this.state.filterText;
		if (keyword == null) {
			return true;
		}
		return 	item.desscription.indexOf(keyword) > -1 ||
					item.tag.indexOf(keyword) > -1 ||
					item.name.indexOf(keyword) > -1 ||
					String(item.price).indexOf(keyword) > -1;
	}

	handleFilterTextChange(value) {
		var newState = {filterText: value};
		if (value && this.state.filterBy === "All Albums") {
			newState["filterBy"] = "All Items";
		}
		this.setState(newState);
	}

	handleCategoryChange(value) {
		this.setState({
			filterBy: value
		})
	}

	goToCloseup(sellerCollege, sellerID, imageKey) {
		const path = "/closeup/" + sellerCollege + "/" + sellerID + "/unsold/" + imageKey;
		this.props.history.push(path)
	}
}

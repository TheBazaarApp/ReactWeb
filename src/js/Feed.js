import React, { Component } from 'react'
import '../css/App.css'
import { FormGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap'
import { browserHistory } from 'react-router'
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
						onClick={this.goToCloseup} />);
				})
		} else {
			itemsToShow = this.props.albums.map(
				(album, index) => {
					return(
					album.unsoldItems.filter(this.filterByCategory).map(
						(item, index) => {
							return( <Item 
								key={item.imageKey} 
								item={item} 
								onClick={this.goToCloseup} 
								sellerCollege={album.sellerCollege}
								sellerID={album.sellerCollege}
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
						<FormControl type="text" placeholder="Filter by keyword" />
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



	filterByCategory(item) {
		const category = this.state.filterBy;
		return (category === "All Items" || item.tag === category);
	}

	handleCategoryChange(value) {
		this.setState({
			filterBy: value
		})
	}

	goToCloseup(sellerCollege, sellerID, imageKey) {
		const path = "/closeup/" + sellerCollege + "/" + sellerID + "/unsold/" + imageKey;
		//const path = "/closeup/" + imageKey;
		browserHistory.push(path);
	}

}

import React, { Component } from 'react'
import '../css/App.css'
import { Button, Image, FormGroup, FormControl, DropdownButton, MenuItem, Carousel } from 'react-bootstrap'
import { browserHistory } from 'react-router'


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
					return( <Album key={album.albumID} album={album} activeIndex={0} goToCloseup={this.goToCloseup} />);
				})
		} else {
			itemsToShow = this.props.albums.map(
				(album, index) => {
					return(
					album.unsoldItems.filter(this.filterByCategory).map(
						(item, index) => {
							return( <Item key={item.imageKey} item={item} goToCloseup={this.goToCloseup} />);
						}
					))
				}
			)
		}

		return (
			<div className="wrapper ugh">
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

	goToCloseup(imageKey) {
		const path = "/closeup/" + imageKey;
		browserHistory.push(path);
	}

}

class Album extends Component {
	render() {
		return (
			<div>
				<Carousel className="small center">
					{this.props.album.unsoldItems.map((item) => {
						return ( 			
							<Button key={item.imageKey} onClick={() => this.props.goToCloseup(item.imageKey)}>
								<Carousel.Item>
									<Image className="small" src={item.picture} />
									<PriceSticker price={item.price} />
								</Carousel.Item>
							</Button>
						);
					})}
				</Carousel>
			</div>
		)
	}
} 
 //{/* TODO: Is there a more elegant way to do this (e.g. put button and sticker outside carousel?*/}



class Item extends Component {
	render() {
		return (
			<div>
				<Button onClick={() => this.props.goToCloseup(this.props.item.imageKey)}>
					<Image  className="small" src={this.props.item.picture} thumbnail />
					<PriceSticker className="ugh" price={"$" + this.props.item.price} />
				</Button>
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




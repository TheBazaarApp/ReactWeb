import React, { Component } from 'react'
import '../css/App.css'
import { Button, Image, FormGroup, FormControl, DropdownButton, MenuItem, Carousel } from 'react-bootstrap'
import { browserHistory } from 'react-router'

export class Feed extends Component {


	// test() {
	// 	console.log("test yay!!!");
	// }


	//TODO: Possibly use user rather than uid
	//TODO: Later make it not just one automatic user
	constructor() {
		super();
		//this.test();
		this.state = {
			filterBy: "All Albums"
		}
		//Event handlers
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.filterByCategory = this.filterByCategory.bind(this);
	}

	render() {
		const filterCategories = ["All Albums", "All Items", "Fashion", "Electronics", "Appliances", "Transportation", "Furniture", "School Supplies", "Services", "Other"];
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






export default Feed;



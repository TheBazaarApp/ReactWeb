import React, { Component } from 'react'
import '../css/App.css'
import { Button, Image, FormGroup, FormControl, DropdownButton, MenuItem, Carousel } from 'react-bootstrap'


export class Feed extends Component {
	render() {
		const filterCategories = ["All Albums", "All Items", "Fashion", "Electronics", "Appliances", "Transportation", "Furniture", "School Supplies", "Services", "Other"];
		return (
			<div className="wrapper ugh">
				<div className="side-by-side">
					<FormGroup>
						<FormControl 
							type="text"
							placeholder="Filter by keyword" />
					</FormGroup>
					<DropdownButton title="Category">
						{filterCategories.map((category, index) => {
							return ( <MenuItem eventkey={index}>{category}</MenuItem> );
						})}
					</DropdownButton>
				</div>
				<Item pic="cheetah.jpg" price="$3" />  
				<Item pic="cheetah.jpg" price="$3" />
				<Album pic="cheetah.jpg" price="$3"/>
			</div>
		)
	}
}

//


class Album extends Component {
	render() {
		return (
			<div>
				<Button>
					<Carousel className="small center">
						<Carousel.Item>
							<Image className="small" src={this.props.pic} />
						</Carousel.Item>
						<Carousel.Item>
							<Image src={this.props.pic} />
						</Carousel.Item>
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
					<Image  className="small" src={this.props.pic} thumbnail />
				</Button>
				<PriceSticker price={this.props.price} />
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











// class Album extends Component {
// 	render() {
// 		return (
// 			<div></div>
// 		)
// 	}
// }

 

// class Album extends Component {
// 	render() {
// 		return (
// 		)
// 	}
// }



				// <div className="container">        
				// 	<div className="masonry-container">
				// 		<Item pic="cheetah.jpg" price="$3"/>
				// 		<Item pic="cheetah.jpg" price="$3"/>
				// 		<Item pic="cheetah.jpg" price="$3"/>
				// 		<Item pic="cheetah.jpg" price="$3"/>
				// 	</div>
				// </div>


export default Feed;



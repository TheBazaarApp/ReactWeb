import React, { Component } from 'react'
import '../css/App.css'
import { Button, ButtonGroup } from 'react-bootstrap' //TODO: Are all these used?
import Album from './Album'
import Item from './Item'

export default class MyItems extends Component {

	constructor(props) {
		super();
		this.state = {
			albumView: true,
			category: props.match.params.category,
		}
		//Event handlers


	}

	render() {
		let category = this.state.category;
		let items = null;
		switch(category) {
			case 'unsold':
				if (this.state.albumView) {
					items = this.props.albums.map( (album) => {
						return( <Album 
							key={album.albumID} 
							album={album} 
							activeIndex={0} 
							showPrice={false}
							onClick={this.goToCloseup} />);
					})
				} else {
					items = this.props.albums.map((album) => {
						return(
							album.unsoldItems.map(
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
				};
				break;
			case 'sold':
				items = this.props.soldItems.map(
					(item, index) => {
						return( <Item 
							key={item.imageKey} 
							item={item} 
							onClick={this.goToCloseup} 
							sellerCollege={this.props.user.college}
							sellerID={this.props.user.uid}
							showPrice={true}
							user={this.props.user}/>
						);
					}
				);
				break;
			case 'purchased':
				items = this.props.purchasedItems.map(
					(item, index) => {
						return( <Item 
							key={item.imageKey} 
							item={item} 
							onClick={this.goToCloseup} 
							sellerCollege={this.props.user.college}
							sellerID={this.props.user.uid}
							showPrice={true}
							user={this.props.user}/>
						);
					}
				);
				break;
			default:
				console.log("something weird is going on here")
		}


		return(
			<div>
				<ButtonGroup bsSize="large" className="margin-10">
					<Button selected onClick={() => this.setCategory('unsold')}>Unsold</Button>
					<Button onClick={() => this.setCategory('sold')}>Sold</Button>
					<Button className="small-width" onClick={() => this.setCategory('purchased')}>Purchased</Button>
				</ButtonGroup>
				<ButtonGroup bsSize="large">
					<Button selected onClick={() => this.setAlbumView(true)}>Album View</Button>
					<Button onClick={() => this.setAlbumView(false)}>Item View</Button>
				</ButtonGroup>
				{items}
			</div>
		)
	}

	setCategory(category) {this.setState({category: category})}
	setAlbumView(albumView) {this.setState({albumView: albumView})}
	goToCloseup(sellerCollege, sellerID, imageKey) {
		const path = "/closeup/" + sellerCollege + "/" + sellerID + "/unsold/" + imageKey;
		this.props.history.push(path)
	}



}
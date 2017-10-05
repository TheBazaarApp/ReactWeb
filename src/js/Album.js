import React, { Component } from 'react'
import '../css/App.css'
import { Image, Carousel } from 'react-bootstrap'
//import PriceSticker from './PriceSticker'

export default class Album extends Component {
	render() {
		const album = this.props.album;
		// let price = null;
		// if (this.props.showPrice) {
		// 	price = (<PriceSticker price={item.price} />);
		// }
		return (
			<div className="feed-item">
				<Carousel className="center red small-width">
					{album.unsoldItems.map((item) => {
						return ( 			
							<Carousel.Item className="whatever" key={item.imageKey} onClick={() => this.props.onClick(album.sellerCollege, album.sellerID, item.imageKey)}>
								<div className="item-price">{item.price}</div>
								<Image className="default-pic" src={item.picture} />
							</Carousel.Item>
						);
					})}
				</Carousel>
			</div>
		)
	} 
}
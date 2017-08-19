import React, { Component } from 'react'
import '../css/App.css'
import { Button, Image, Carousel } from 'react-bootstrap'
import PriceSticker from './PriceSticker'

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
							<Carousel.Item className="purple" key={item.imageKey} onClick={() => this.props.onClick(album.sellerCollege, album.sellerID, item.imageKey)}>
								<Image className="small fit default-pic" src={item.picture} />
								<PriceSticker price={item.price} />
							</Carousel.Item>
						);
					})}
				</Carousel>
			</div>
		)
	} 
}
import React, { Component } from 'react'
import '../css/App.css'
import { Button, Image, Carousel } from 'react-bootstrap'
import PriceSticker from './PriceSticker'

export default class Album extends Component {
	render() {
		const album = this.props.album;
		let price = null;
		if (this.props.showPrice) {
			price = (<PriceSticker price={item.price} />);
		}
		return (
			<div>
				<Carousel className="small center">
					{album.unsoldItems.map((item) => {
						return ( 			
							<Button key={item.imageKey} onClick={() => this.props.onClick(album.sellerCollege, album.sellerID, item.imageKey)}>
								<Carousel.Item>
									<Image className="small" src={item.picture} />
									{price}
								</Carousel.Item>
							</Button>
						);
					})}
				</Carousel>
			</div>
		)
	}
}
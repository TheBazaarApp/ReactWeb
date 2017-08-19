import React, { Component } from 'react'
import '../css/App.css'
import { Button, Image } from 'react-bootstrap'
import PriceSticker from './PriceSticker'

export default class Item extends Component {
	render() {
		let price = null;
		if (this.props.showPrice) {
			price = (<PriceSticker price={"$" + this.props.item.price} />);
		}
		return (
			<div>
				<Button className="small" onClick={() => this.props.onClick(this.props.sellerCollege, this.props.sellerID, this.props.item.imageKey)}>
					<Image className="small" src={this.props.item.picture} thumbnail />
					{price}
				</Button>
				{/*TODO: format price better*/}
			</div>
		)
	}
}
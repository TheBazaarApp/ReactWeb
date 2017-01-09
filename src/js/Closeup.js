import React, { Component } from 'react'
import '../css/App.css'
import { Link } from 'react-router'
import { Image, Button } from 'react-bootstrap'


export default class Closeup extends Component {
	render() {
		const itemData = this.getItem();
		return (
			<div>
				<div className="inline">
					<Image className="newPic" src="cheetah.jpg" />
					<Button>Buy</Button>
				</div>
				<div className="inline">
					<table>
						<tbody>
							<tr>
								<td>Item:</td>
								<td>{itemData.item.name}</td>
							</tr>
							<tr>
								<td>Price:</td>
								<td>{itemData.item.price}</td>
							</tr>
							<tr>
								<td>Seller:</td>
								<td>
									<Link to={'/profile/' + itemData.album.sellerCollege + "/" + itemData.album.sellerID}>{itemData.album.sellerName}</Link>
								</td>
							</tr>
						</tbody>
					</table>
					PUT LOCATION HERE
				</div>



			</div>
		)
	}

	//TODO: Instead, maybe we can pass the data from the app
	getItem() {
		for (let album of this.props.albums) {
			for (let item of album.unsoldItems) {
				if (item.imageKey === this.props.params.itemID) {
					return {item:item, album:album};
				}
			}
		}
	}

}
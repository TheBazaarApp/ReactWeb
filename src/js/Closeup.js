import React, { Component } from 'react'
import '../css/App.css'
import { Link } from 'react-router'
import { Image, Button } from 'react-bootstrap'
import { MenuBar } from './Navbar'


export default class Closeup extends Component {
	render() {
		return (
			<div>
				<MenuBar />
				<div className="inline">
					<Image className="newPic" src="cheetah.jpg" />
					<Button>Buy</Button>
				</div>
				<div className="inline">
					<table>
						<tbody>
							<tr>
								<td>Item:</td>
								<td>Antimatter</td>
							</tr>
							<tr>
								<td>Price:</td>
								<td>$3.45</td>
							</tr>
							<tr>
								<td>Seller:</td>
								<td>
									<Link>Gavin Yancey</Link>
								</td>
							</tr>
						</tbody>
					</table>
					PUT LOCATION HERE
				</div>



			</div>
		)
	}
}
import React from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { browserHistory } from 'react-router'

// Useful link: https://react-bootstrap.github.io/components.html#navbars
//TODO: If necessary, ditch react-router.  If we want to keep it, simulate NavItem with this:  <Link to="/about">Please Work</Link>
//TODO: Or use the onclick function here to navigate.


//CURRENT STATUS:
//		- Most links aren't yet functional, but some are
//		- Does not yet deal with the case where a user is not logged in


//Menubar - This class defines the menu bar which appears across all pages of the site
export default class MenuBar extends React.Component {
	render() {
		return(
			<Navbar inverse collapseOnSelect>

				<Navbar.Header>
					<Navbar.Brand>
						<a href="#">Bazaar</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>

			{/*On small screens, this section is not visible.  There's a dropdown instead.*/}
				<Navbar.Collapse>
					<Nav>
						<NavItem onClick={() => this.navigate("feed")}>Feed</NavItem>
						<NavItem onClick={() => this.navigate("myItems/" + this.props.college + "/" + this.props.uid + "/unsold")}>My Items</NavItem>
						<NavItem onClick={() => this.navigate("newAlbum")}>Sell</NavItem>
						<NavItem onClick={() => this.navigate("profile/" + this.props.college + "/" + this.props.uid)}>Profile</NavItem>
						<NavItem >Contacts</NavItem>
						<NavItem >Notifications</NavItem>
						<NavItem  onClick={() => this.navigate("settings/")}>Settings</NavItem>
					</Nav>
					<Nav pullRight>
						<NavItem eventKey={1} href="#">Log Out</NavItem>
					</Nav>
				</Navbar.Collapse>

			</Navbar>
		)
	}

	navigate(destination) {
		const path = "/" + destination;
		browserHistory.push(path);
	}
}

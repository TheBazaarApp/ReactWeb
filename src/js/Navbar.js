import React from 'react'
//import { Link } from 'react-router' //TODO: Look into when curlies are necessary
import { Navbar, Nav, NavItem } from 'react-bootstrap'

// Useful link: https://react-bootstrap.github.io/components.html#navbars



//TODO: If necessary, ditch react-router.
//TODO: If we want to keep this, simulate NavItem with this:  <Link to="/about">Please Work</Link>
//TODO: Or use the onclick function here to navigate.
//TODO: Do I really need export here?
export class MenuBar extends React.Component {
	render() {
		return(
			<Navbar inverse collapseOnSelect>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#">Bazaar</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						<NavItem eventKey={0} href="/about">Feed</NavItem>
						<NavItem eventKey={1} href="#">My Items</NavItem>
						<NavItem eventKey={6} href="#">Sell</NavItem>
						<NavItem eventKey={2} href="#">Profile</NavItem>
						<NavItem eventKey={3} href="#">Contacts</NavItem>
						<NavItem eventKey={4} href="#">Notifications</NavItem>
						<NavItem eventKey={5} href="#">Settings</NavItem>
					</Nav>
					<Nav pullRight>
						<NavItem eventKey={1} href="#">Log Out</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}
}

export default Navbar;
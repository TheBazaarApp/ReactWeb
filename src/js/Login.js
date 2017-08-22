import React, { Component } from 'react'
import '../css/App.css'
import { Button } from 'react-bootstrap'
import * as firebase from 'firebase'
import FieldGroup from './RepeatedComponents/FieldGroup'
import { browserHistory } from 'react-router'

export default class Login extends Component {

	constructor() {
		super();
		this.state = {
			page: 0,
			isLogin: false
		};
	}

	render() {
		return(
			<div>
				<h1>Bazaar</h1>
				<div>
				{/*Page 0 - Login*/}
					{this.state.page === 0 &&
						<div className="login-text">
							<h2>Login</h2>
							<FieldGroup
								type="text"
								label=".Edu Email"
								onChange={(e) => this.updateState("email", e.target.value)}
							/>
							<FieldGroup
								type="password"
								label="Password"
								onChange={(e) => this.updateState("password", e.target.value)}
							/>
							<Button block onClick={() => this.login()}>Login</Button>
							<Button block onClick={() => this.updateState("page", 1)}>Don't have an account? Create one here.</Button>
						</div>
					}
				{/*Page 1 - Create Account*/}
					{this.state.page === 1 &&
						<div className="login-text">
							<h2>Create Account</h2>
							<FieldGroup
								type="text"
								label="First Name"
								onChange={(e) => this.updateState("firstName", e.target.value)}
							/>
							<FieldGroup
								type="text"
								label="Last Name"
								onChange={(e) => this.updateState("lastName", e.target.value)}
							/>
							<FieldGroup
								type="text"
								label=".Edu Email"
								onChange={(e) => this.updateState("page", 0)}
							/>
							<FieldGroup
								type="password"
								label="Password"
								onChange={(e) => this.updateState("password", e.target.value)}
							/>
							<FieldGroup
								type="password"
								label="Retype Password"
								onChange={(e) => this.updateState("retypePassword", e.target.value)}
							/>
							<Button block onClick={() => this.createAccount()}>Create Account</Button>
							<Button block onClick={() => this.updateState("isLogin", !this.state.isLogin)}>I already have an account.</Button>
						</div>
					}
				{/*Page 1 - College*/}
					{this.state.page === 2 &&
						<div>
							<h2>Based on your email, we believe your college is</h2>
							<h1>{this.state.inferredCollege}</h1>
							<Button>That's my college!</Button>
							<Button>Incorrect College</Button>
						</div>
					}
				{/*Page 2 - Select College*/}
					{this.state.page === 3 &&
						<div>
							<h2>Based on your email, we believe your college is</h2>
							<h1>{this.state.inferredCollege}</h1>
						</div>
					}
				{/* Page 3 - Colleges you're trading with*/}
					{this.state.page === 4 &&
						<div>
							<h1>Select Colleges to Trade With</h1>
						</div>
					}
				{/*Page 4 - Success*/}
					{this.state.page === 5 &&
						<div>
							<h1>Registration successful!</h1>
							<Button block>Continue to Feed</Button>
						</div>
					}
				</div>
			</div>
		)
	}

	updateState(key, value) {
		var newState = {};
		newState[key] = value;
		this.setState(newState);
	}

	inferCollege() {
		return "hi"
	}

	login(handleNavigate) {
		if (!this.state.email || !this.state.email.endsWith('.edu')) {
			return alert('Please enter a valid .edu email');
		}
		if (!this.state.password || this.state.password=== "") {
			return alert('Please enter a password');
		}
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
		.then((user) => {
			if (user.emailVerified) {
				this.navigate('/feed')
			}
			else {
				firebase.auth().signOut()
				return alert('Please Verify Email', 'You must verify your email before signing in')
			}
		},
		function(error) {
			return alert('Error signing in', error.message)
		});
	}

	createAccount() {
		var collegeDomains = [];//TODO - real thing!

		if (!this.state.email || !this.state.email.endsWith('.edu')) {
			return alert('Please enter a valid .edu email');
		}
		if (!this.state.firstName || !this.state.firstName=== "") {
			return alert('Please enter a first name');
		}
		if (!this.state.lastName || this.state.lastName=== "") {
			return alert('Please enter a last name');
		}
		if (!this.state.password || this.state.password=== "") {
			return alert('Please enter a password');
		}
		if (!this.state.password !== this.state.retypePassword) {
			return alert('Passwords do not match.');
		}
		firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
		.then((user) => {
			user.sendEmailVerification().then( () => {
				var mail = this.state.email.split("@")
				var domain = mail[1]
				const collegeIndex = collegeDomains.indexOf(domain)
				if (collegeIndex > -1) {
					user.updateProfile({displayName: this.state.firstName.replace(/\s+/g, '') + ' ' + this.state.lastName.replace(/\s+/g, '')})
				}
			},
			function(error) {
				alert(error.message)
			});
		},
		function(error) {
			return alert(error.message)
	});
	}
	
	navigate(destination) {
		browserHistory.push(destination);
	}
}
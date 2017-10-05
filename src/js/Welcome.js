import React, { Component } from 'react'
import '../css/App.css'
import "../../node_modules/react-widgets/dist/css/react-widgets.css"
import { Button, 
			Modal, 
			FormControl, 
			Checkbox,
			FormGroup,
			 } from 'react-bootstrap'
import * as firebase from 'firebase'
import FieldGroup from './RepeatedComponents/FieldGroup'
import Multiselect from 'react-widgets/lib/Multiselect'
import { collegeDomains } from '../data/collegeDomains'
import { collegeStrings } from '../data/collegeStrings'

//TODO:
// Make home page = login if you're not logged in
// UI could be better
// Bazaar - have an actual logo
// Make all popups look nice

//(later) TODO:
// red validation on required inputs
// Freeze buttons after press


export default class Welcome extends Component {

	constructor() {
		super();
		this.state = {
			page: 0,
			isLogin: false,
			modalStatus: "input"
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
							<Button block onClick={() => this.updateState("forgotPasswordPopup", true)}>Forgot Password</Button>
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
								onChange={(e) => this.updateState("email", e.target.value)}
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
							<Button block onClick={() => this.updateState("page", 0)}>I already have an account.</Button>
						</div>
					}
				{/*Page 1 - College*/}
					{this.state.page === 2 &&
						<div>
							<h2>Based on your email, we believe your college is</h2>
							<h1>{this.state.college}</h1>
							<Button onClick={() => this.multiUpdateState([["page", 4],["college", null]])}>That's my college!</Button>
							<Button onClick={() => this.updateState("page", 3)}>Incorrect College</Button>
						</div>
					}
				{/*Page 2 - Select College*/}
					{this.state.page === 3 &&
						<div>
							<h2>Select your college from the list:</h2>
							<FormControl 
								disabled={this.state.otherCollege}
								componentClass="select"
								onChange={(e) =>{this.updateState("college", e.target.value)}}>
								<option value={null}></option>
								{collegeStrings.map(
									(college, index) => {
										return( <option 
												key={index} 
												value={college}>{college}</option>
											);
										})
									}
							</FormControl>
							<FormGroup>
								<Checkbox onChange={(e) => {this.multiUpdateState([["otherCollege", e.target.checked],["college", null]])}}>My college isn't listed.</Checkbox>
							</FormGroup>
							<FieldGroup
								type="text"
								disabled={!this.state.otherCollege}
								label="Other"
								onChange={(e) => this.updateState("college", e.target.value)}/>
							
							<Button block
								disabled={!this.state.college}
								onClick={() => this.updateState("page", 4)}>Continue</Button>
						</div>
					}
				{/* Page 3 - Colleges you're trading with*/}
					{this.state.page === 4 &&
						<div>
							<h1>Select Colleges to Trade With</h1>
							<Multiselect 
								value={this.state.tradingColleges}
								onChange={value => this.updateState('tradingColleges', value)}
								data={collegeStrings}/>
							<br/>
							<Button block onClick={() => this.updateState("page", 5)}>Continue</Button>
						</div>
					}
				{/*Page 4 - Success*/}
					{this.state.page === 5 &&
						<div>
							<h3>Registration successful! Your last step is to check your email and click the verification link. Then, return here to continue to the feed.</h3>
							<Button onClick={() => this.maybeGoToFeed()} block>Continue to feed.</Button>
						</div>
					}
				</div>

			{/*Forgot password popup.*/}
				<Modal 
					show={this.state.forgotPasswordPopup} 
					onHide={this.closePopups.bind(this)}>
					<Modal.Header closeButton>
						<Modal.Title>Password Recovery</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.state.forgotPasswordPopup && this.state.modalStatus==="input" &&
						<div>
							We will send you an email asking you to choose a new password.

							<br/><br/>

							<FieldGroup
								type="text"
								label="Email"
								onChange={(e) => this.updateState("recoveryEmail", e.target.value)}
							/>

							<Button 
								block 
								bsStyle="primary" 
								bsSize="large"
								onClick={() => this.recoverPassword()}>Send Password Recovery Email</Button>
						</div>}

						{this.state.modalStatus==="success" &&
							"Password reset email sent."}

						{this.state.modalStatus==="error" &&
							this.state.errorMessage}

					</Modal.Body>
				</Modal>


			</div>
		)

	}

	maybeGoToFeed() {
		firebase.auth().currentUser.reload().then(function() {
			var user = firebase.auth().currentUser;
				if (user && user.emailVerified) {
					this.navigate('/feed');
				} else {
					alert("Either you aren't registerd or your email isn't verified.");
				}
		}.bind(this));
	}

	recoverPassword() {
		if(!this.state.recoveryEmail) {
			alert("Please enter an email.");
		}

		firebase.auth().sendPasswordResetEmail(this.state.recoveryEmail).then(function() {
			this.setState({
				modalStatus: "success"
			});
		}.bind(this)).catch(function(error) {
			this.setState({
				modalStatus: "error",
				errorMessage: error.message,
			});
		}.bind(this))
	}

	updateState(key, value) {
		var newState = {};
		newState[key] = value;
		this.setState(newState);
	}

	multiUpdateState(newValues) {
		var newState = {};
		for (var newVal of newValues) {
			newState[newVal[0]] = newVal[1];
		}
		this.setState(newState);
	}

	closePopups() {
		this.setState({
			forgotPasswordPopup: false,
			modalStatus: "input",
		});
	}

	inferCollege() {
		var collegeIndex = collegeDomains.indexOf(this.state.email.substring(this.state.email.indexOf('@') + 1));
		if (collegeIndex > -1) {
			this.setState({college: collegeStrings[collegeIndex]});
			return true;
		}
		return false;
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
				this.navigate('/feed');
			}
			else {
				firebase.auth().signOut()
				return alert('Please Verify Email', 'You must verify your email before signing in')
			}
		},
		function(error) {
			return alert(error.message)
		});
	}

	createAccount() {

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
		if (this.state.password !== this.state.retypePassword) {
			return alert('Passwords do not match.');
		}
		firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
		.then((user) => {
			user.sendEmailVerification().then( () => {
				user.updateProfile({displayName: this.state.firstName.replace(/\s+/g, '') + ' ' + this.state.lastName.replace(/\s+/g, '')})
				if (this.inferCollege()) {
					this.updateState('page', 2);
				} else {
					this.updateState('page', 3);
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
		this.props.history.push(destination);
	}
}
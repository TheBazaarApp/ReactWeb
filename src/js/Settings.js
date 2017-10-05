import React, { Component } from 'react'
import '../css/App.css'
import { Button, 
			ControlLabel, 
			FormControl, 
			FormGroup, 
			Checkbox, 
			HelpBlock,
			Modal
		} from 'react-bootstrap'
import * as firebase from 'firebase'
import FieldGroup from './RepeatedComponents/FieldGroup'
import Popup from './RepeatedComponents/Popup'

export default class Settings extends Component {

	constructor() {
		super();
		this.state={
			modalStatus: "input"
		};
	}

	render() {
		return (
			<div>
				<h1>Settings</h1>
				<div className="body-width">
					<ControlLabel>Email: </ControlLabel> {"owatkins@hmc.edu"} {/*firebase.auth().currentUser.email*/}
					<FormGroup>
						<Checkbox>Send Notifications</Checkbox>
					</FormGroup>
					<FormGroup>
						<Checkbox>Send Email Updates</Checkbox>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Colleges I'm Trading With</ControlLabel>
						<FormControl componentClass="select" multiple>
							<option>hi</option>
							<option>bye</option>
							<option>see ya</option>
						</FormControl>
						<HelpBlock>Hold the Control/Command key to select multiple colleges.</HelpBlock>
					</FormGroup>
					<Button>Save Changes</Button>
					<br/>
					<hr/>
					<br/>
					<Button block onClick={() => this.updateState("changeEmailPopup", true)}>Change Email</Button>
					<Button block onClick={() => this.updateState("changePasswordPopup", true)}>Change Password</Button>
					<Button block onClick={() => this.updateState("forgotPasswordPopup", true)}>Forgot Password</Button>
					<hr/>
					<FormGroup>
						<ControlLabel>Contact Us</ControlLabel>
						<FormControl componentClass="textarea" placeholder="Please type your message here."/>
						<HelpBlock>We'd love to hear your feedback!</HelpBlock>
					</FormGroup>
					<Button>Send Message</Button>
					<hr/>
					<Button block>Log Out</Button>
					<Button block>Delete Account</Button>
				</div>	

			{/*Change email popup*/}
				<Modal 
					show={this.state.changeEmailPopup} 
					onHide={this.closePopups.bind(this)}>
					<Modal.Header closeButton>
						<Modal.Title>Change Email</Modal.Title>
					</Modal.Header>
					<Modal.Body>
					{this.state.changeEmailPopup && this.state.modalStatus==="input" &&
						<div>
							<FieldGroup
								type="password"
								label="Enter password to confirm this action:"
								placeholder="Password"
								onChange={(e) => this.updateState('currPassword', e.target.value)}
							/>
							<FieldGroup
								type="password"
								label="New Email:"
								placeholder="Email"
								onChange={(e) => this.updateState('newEmail', e.target.value)}
							/>
							<br/>
							<Button 
								block 
								bsStyle="primary" 
								bsSize="large"
								onClick={() => this.changeEmail()}>Change Email</Button>
							</div>
						}

						{this.state.modalStatus==="success" &&
							"Email updated."}

						{this.state.modalStatus==="error" &&
							this.state.errorMessage}

					</Modal.Body>
				</Modal>

		{/*Change password popup*/}
				<Popup
						title="Change Password"
						showPopup={this.state.changePasswordPopup} 
						hidePopup={this.closePopups.bind(this)}	
						action={this.changePassword.bind(this)}
						actionText="Change Password">
					<FieldGroup
						type="password"
						label="Old Password"
						onChange={(e) => this.updateState("currPassword", e.target.value)}
					/>
					<FieldGroup
						type="password"
						label="New Password"
						onChange={(e) => this.updateState("newPassword", e.target.value)}
					/>
					<FieldGroup
						type="password"
						label="Confirm New Password"
						onChange={(e) => this.updateState("confirmPassword", e.target.value)}
					/>
				</Popup>

				<Popup 
					showPopup={this.state.simpleAlert}
					hidePopup={this.closePopups.bind(this)}>
					{this.state.alertMessage}
				</Popup>

				{/*<Modal 
					show={this.state.changePasswordPopup} 
					onHide={this.closePopups.bind(this)}>
					<Modal.Header closeButton>
						<Modal.Title>Change Password</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.state.changePasswordPopup && this.state.modalStatus==="input" &&
							<div>
								<FieldGroup
									type="password"
									label="Old Password"
									onChange={(e) => this.updateState("currPassword", e.target.value)}
								/>
								<FieldGroup
									type="password"
									label="New Password"
									onChange={(e) => this.updateState("newPassword", e.target.value)}
								/>
								<FieldGroup
									type="password"
									label="Confirm New Password"
									onChange={(e) => this.updateState("confirmPassword", e.target.value)}
								/>

								<Button 
									block 
									bsStyle="primary" 
									bsSize="large"
									onClick={this.changePassword.bind(this)}>Change Password</Button>
							</div>
						}

						{this.state.modalStatus==="success" &&
							"Password updated."}

						{this.state.modalStatus==="error" &&
							<div>
								{this.state.errorMessage}

								<br/><br/>
								<Button 
									block
									bsStyle="primary" 
									bsSize="large"
									onClick={() => this.updateState("modalStatus", "input")}>Okay</Button>

							</div>}

					</Modal.Body>
				</Modal>*/}

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

	changeEmail() {
		if (!this.state.currPassword) {
			this.setState({
				modalStatus: "error",
				errorMessage: "Please input your password."
			})
			return;
		}
		if (!this.state.newEmail) {
			this.setState({
				modalStatus: "error",
				errorMessage: "Please input your new email."
			})
			return;
		}
		var user = firebase.auth().currentUser;
		// re-authenticate
		var credential = firebase.auth.EmailAuthProvider.credential(user.email, this.state.currPassword);
		user.reauthenticateWithCredential(credential).then(function() {
			firebase.auth().currentUser.updateEmail(this.state.newEmail).then(function() {
				//It worked!
				this.setState({modalStatus: "success"});
			}.bind(this)).catch(function(error) {
				this.setState({
					modalStatus: "error",
					errorMessage: error.message,
				});
			}.bind(this));
		}.bind(this)).catch(function(error) {
			this.setState({
					modalStatus: "error",
					errorMessage: error.message,
				});
		}.bind(this));
	}

	changePassword() {
		console.log(this);
		alert("hi");
		if (this.state.newPassword !== this.state.confirmPassword) {
			this.newPopup();
			this.setState({
				simpleAlert: true,
				alertMessage: "The new password fields do not match.",
			});
			return;
		}
		if (!this.state.newPassword) {
			this.newPopup();
			this.setState({
				simpleAlert: true,
				alertMessage: "Please input your new password.",
			});
			return;
		}
		if (!this.state.currPassword) {
			this.newPopup();
			this.setState({
				simpleAlert: true,
				alertMessage: "Please input your current password.",
			});
			return;
		}
		var user = firebase.auth().currentUser;
		// re-authenticate
		var credential = firebase.auth.EmailAuthProvider.credential(user.email, this.state.currPassword);
		console.log(user);
		user.reauthenticateWithCredential(credential).then(function() {
			firebase.auth().currentUser.updatePassword(this.state.newPassword).then(function() {
				//It worked!
				this.setState({
					modalStatus: "success"
				});
			}.bind(this)).catch(function(error) {
				this.setState({
					modalStatus: "error",
					errorMessage: error.message,
				});
			}.bind(this));
		}.bind(this)).catch(function(error) {
			this.setState({
					modalStatus: "error",
					errorMessage: error.message,
				});
		}.bind(this));
	}

	recoverPassword() {
		firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email).then(function() {
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

	newPopup() {
		// Close existing ones
		this.setState({ 
			changeEmailPopup: false,
			changePasswordPopup: false,
			forgotPasswordPopup: false,
			deleteAccountPopup: false,
			modalStatus: "input",
		});
	}

	closePopups() {
		this.setState({ 
			changeEmailPopup: false,
			changePasswordPopup: false,
			forgotPasswordPopup: false,
			deleteAccountPopup: false,
			modalStatus: "input",
			errorMessage: null,
			currPassword: null,
			newPassword: null,
			confirmPassword: null,
			newEmail: null,
			simpleAlert: false,
		});
	}

	signOut(){
		firebase.auth().signOut().then(() => console.log("signed out successfully"));
		this.navigate('')
	}






}


// - Logout
// - Delete Account
// - Colleges list mine), say what you're trading with'
// - Send emails boolean
// - Add Colleges
//~ Change emails
//~ change password
// Contact us
// notifications
					// <ControlLabel>Email Updates On</ControlLabel>
					// <FormControl type="checkbox"/>
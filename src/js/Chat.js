import React, { Component } from 'react'
import '../css/App.css'
//import { GiftedChat } from 'react-web-gifted-chat'
import {ChatFeed, Message} from 'react-chat-ui'
import * as firebase from 'firebase'
import { Button } from 'react-bootstrap'

function Contact({contactData, selected}) {
	return (
		<Button block selected={true} onClick={() => this.props.switchSelected()}>
			{contactData.name}
		</Button>
	)
}

export default class Chat extends Component {

	constructor(props) {
		super();
		this.state = {
			contacts: [],
			messages: [new Message({id: 0, message: "sender yeah!"}), new Message({id: 1, message: " reciever yeah!"})]
		}
		this.getContacts(props);
	}

	getContacts(props) {
		var contactsRef = firebase.database().ref().child(props.college + "/user/" + props.user.uid + "/messages/recents")
		console.log("CONTACTS REF", props.college + "/user/" + props.user.uid + "/messages/recents")		
		contactsRef.on('value', function(snapshot) {
			var contacts = []
			for (var contactUID in snapshot.val()) {
				var contactInfo = snapshot.child(contactUID).val();
				contactInfo.uid = contactUID;
				contacts.push(contactInfo);
				//TODO(olivia): Maybe get pics in there?
			}
			this.setState({contacts: contacts});
		}.bind(this));
	}

	switchSelected() {
		alert("switching seelcted");
	}

	onSend(messages = []) {
		//TODO: fix how we get these keys
		const messageKeyReceiver = firebase.ref().child(this.props.user.college + "/user/" + this.props.user._id + "/messages/all/" + this.props.chattingUser._id).push().key
		const messageKeySender = firebase.ref().child(this.props.chattingUser.college + "/user/" + this.props.chattingUser._id + "/messages/all/" + this.props.user._id).push().key

		const recentsUpdateReceiver = {
			name: this.props.user.name,
			timestamp: messages[0].createdAt
		}

		const recentsUpdateUser = {
			name: this.props.chattingUser.name,
			timestamp: messages[0].createdAt
		}
		
		var newMessageSender = {}
		var newMessageReceiver = {}
		if (messages[0].image) {
			newMessageReceiver = {
				_id: messageKeyReceiver,
				image: messages[0].image,
				createdAt: messages[0].createdAt,
				user: {
								_id: this.props.user._id,
								name: this.props.user.name,
								avatar: this.props.user.avatar
				}
			}
			newMessageSender = {
				_id: messageKeyReceiver,
				image: messages[0].image,
				createdAt: messages[0].createdAt,
				user: {
								_id: this.props.user._id,
								name: this.props.user.name,
								avatar: this.props.user.avatar
				}
			}
		}
		else if (messages[0].location) {
			newMessageReceiver = {
				_id: messageKeyReceiver,
				location: messages[0].location,
				createdAt: messages[0].createdAt,
				user: {
								_id: this.props.user._id,
								name: this.props.user.name,
								avatar: this.props.user.avatar
				}
			}
			newMessageSender = {
				_id: messageKeyReceiver,
				location: messages[0].location,
				createdAt: messages[0].createdAt,
				user: {
								_id: this.props.user._id,
								name: this.props.user.name,
								avatar: this.props.user.avatar
				}
			}
		}
		else {
			console.log("Fuckkkk")
			newMessageReceiver = {
				_id: messageKeyReceiver,
				text: messages[0].text,
				createdAt: messages[0].createdAt,
				user: {
								_id: this.props.user._id,
								name: this.props.user.name,
								avatar: this.props.user.avatar
				}
			}
			newMessageSender = {
				_id: messageKeyReceiver,
				text: messages[0].text,
				createdAt: messages[0].createdAt,
				user: {
								_id: this.props.user._id,
								name: this.props.user.name,
								avatar: this.props.user.avatar
				}
			}
		}
		var childUpdates = {}
		childUpdates[this.props.user.college + "/user/" + this.props.user._id + "/messages/recents/" + this.props.chattingUser._id] = recentsUpdateUser
		childUpdates[this.props.chattingUser.college + "/user/" + this.props.chattingUser._id + "/messages/recents/" + this.props.user._id] = recentsUpdateReceiver
		childUpdates[this.props.user.college + "/user/" + this.props.user._id + "/messages/all/" + this.props.chattingUser._id + '/' + messageKeySender] = newMessageSender
		childUpdates[this.props.chattingUser.college + "/user/" + this.props.chattingUser._id + "/messages/all/" + this.props.user._id + '/' + messageKeyReceiver] = newMessageReceiver
		firebase.ref().update(childUpdates);
	}

	render() {

		var contactsList = this.state.contacts.map(
				(contactData) => {
					return( <Contact 
						key={contactData.uid} 
						contactData={contactData}
						onClick={this.switchSelected.bind(this)} />);
				})



		return (
			<div>
				<h1>Chat</h1>
				<div className="chat-sidebar inline">Contacts {contactsList}</div>
				<div className="current-chat inline">
					<ChatFeed
						messages={this.state.messages}
						isTyping={true}
						hasInputField={true} />
					<Button>Send</Button>
				</div>
			</div>
		)
	}
}


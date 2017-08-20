import React from 'react';
import '../../css/App.css'
import { 	FormGroup, 
			FormControl, 
			ControlLabel} from 'react-bootstrap'

function FieldGroup({id, label, value, ...props}) {
	return (
		<FormGroup controlId={id}>
			<ControlLabel>{label}</ControlLabel>
			<FormControl value={value} {...props} />
		</FormGroup>
	)
}

export default FieldGroup;
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import TaskList from './TaskList.jsx';

// App component - represents the whole app
class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hideCompleted: false
		};
	}

	handleSubmit(e) {
		e.preventDefault();

		// Find the text field via the React ref
		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

		// Save task to mongo collection
		Tasks.insert({
			text,
			createdAt: new Date() // current time
		});

		// Clear Form
		ReactDOM.findDOMNode(this.refs.textInput).value = '';

		console.log('handle submit');
		console.log(e.target);
	}

	toggleHideCompleted() {
		this.setState({hideCompleted: !this.state.hideCompleted});
	}

	render() {
		var filteredTasks;
		if (this.state.hideCompleted) {
			filteredTasks = this.props.tasks.filter(function(element) {
				return !element.checked;
			});
		} else {
			filteredTasks = this.props.tasks;
		}

		return (
			<div className="container">
				<header>
					<h1>Todo List ({this.props.incompleteCount})</h1>

					<label htmlFor="" className="hide-completed">
						<input type="checkbox"
							readOnly
							checked={this.state.hideCompleted}
							onClick={this.toggleHideCompleted.bind(this)}
						/>
						Hide completed Tasks
					</label>

					<form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
						<input
						type="text"
						ref="textInput"
						placeholder="Type to add new tasks"
						/>
					</form>
				</header>

				<TaskList tasks={filteredTasks}></TaskList>
			</div>
		);
	}
}

App.propTypes = {
	tasks: PropTypes.array.isRequired,
	incompleteCount: PropTypes.number.isRequired
};

export default createContainer(() => {
	return {
		tasks: Tasks.find({}, { sort: { createdAt : -1 }}).fetch(),
		incompleteCount: Tasks.find({ checked: { $ne: true } }).count()
	};
}, App);

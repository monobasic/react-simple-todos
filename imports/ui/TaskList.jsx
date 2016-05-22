import React, { Component, PropTypes } from 'react';


import Task from './Task.jsx';

export default class TaskList extends  Component {

	render() {
		return(
			<ul>
				{this.props.tasks.map(function(task) {
					return <Task key={task._id} task={task}></Task>;
				})}
			</ul>
		);
	}
}

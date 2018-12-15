
import { h, render, Component } from 'preact';
import axios from 'axios';

export default class Logger extends Component {
	state = {
		log_list: []
	}

	componentDidMount() {
		axios.get('/api/data?ident=logger').then(res => this.setState({ log_list: res.data.reverse() }));
	}

	render({}, { log_list }) {
		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center'
		};

		const logs = log_list.map(log => <Log log={ log }></Log>);

		return (
			<div>
				<table className="table is-hoverable is-fullwidth">
					<thead>
						<tr>
							<th style={ row_style }>level</th>
							<th style={ row_style }>group</th>
							<th style='vertical-align: middle; text-align: left;'>message</th>
						</tr>
					</thead>
					<tbody>
						{ logs }
					</tbody>
				</table>
			</div>
		);
	}
}

class Log extends Component {
	render({ log }) {
		return (
			<tr>
				<td style='vertical-align: middle; text-align: center'>{ log.level }</td>
				<td style='vertical-align: middle; text-align: center'>{ log.group }</td>
				<td style='vertical-align: middle; text-align: left'>{ log.message }</td>
			</tr>
		);
	}
}

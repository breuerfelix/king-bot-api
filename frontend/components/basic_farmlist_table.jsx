import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';

export default class BasicFarmlistTable extends Component {
	render({ content, clicked, unitChanged }) {
		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center'
		};

		const list = content.map(item => <Farm content={item} clicked={clicked} unitChanged={unitChanged} />);

		return (
			<div>
				<table className="table is-hoverable is-fullwidth">
					<thead>
						<tr>
							<th style={row_style}>distance</th>
							<th style={row_style}>population</th>
							<th style={row_style}>coordinates</th>
							<th style={row_style}>player</th>
							<th style={row_style}>village</th>
							<th style={row_style}>kingdom</th>
							<th style={row_style}>tribe</th>
							<th style={row_style}>unit type</th>
							<th style={row_style}>unit number</th>
							<th style={row_style}>priority</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{list}
					</tbody>
				</table>
			</div>
		);
	}
}

class Farm extends Component {
	state = {
		toggled: false,
		distance: null,
		player_name: null,
		village_name: null,
		population: null,
		x: null,
		y: null,
		tribeId: null,
		kingdom_tag: null,
		unit_number: 2,
		unit_type: 0,
		priority: 10
	}

	tribe_dict = {
		'1': 'roman',
		'2': 'teuton',
		'3': 'gaul'
	}

	render({ content, clicked, unitChanged }, { toggled }) {
		let { distance, player_name, village_name, population, x, y, tribeId, kingdom_tag, unit_number, unit_type, priority } = content;

		this.state = content;

		distance = Number(distance).toFixed(1);
		const coordinates = `( ${x} | ${y} )`;
		const tribe = this.tribe_dict[tribeId];

		const row_style = {
			verticalAlign: 'middle',
			textAlign: 'center',
			color: color()
		};

		function color() {
			if (priority == 0 || unit_number == 0 || unit_type == 0) return '#FF0000';
			if (priority == -1) return '#FFA500';
			return '#000000';
		}

		const icon = classNames({
			'fas': true,
			'fa-lg': true,
			//'fa-plus': true,
			'fa-minus': true
		});

		return (
			<tr>
				<td style={row_style}>
					{distance}
				</td>
				<td style={row_style}>
					{population}
				</td>
				<td style={row_style}>
					{coordinates}
				</td>
				<td style={row_style}>
					{player_name}
				</td>
				<td style={row_style}>
					{village_name}
				</td>
				<td style={row_style}>
					{kingdom_tag}
				</td>
				<td style={row_style}>
					{tribe}
				</td>
				<td style={row_style}>
					<input
						style="width: 50px;"
						type="text"
						value={unit_type}
						placeholder="0"
						onChange={async e => {
							this.setState({ unit_type: e.target.value });
							await unitChanged(this.state);
						}}
					/>
				</td>
				<td style={row_style}>
					<input
						style="width: 50px;"
						type="text"
						value={unit_number}
						placeholder="2"
						onChange={async e => {
							this.setState({ unit_number: e.target.value });
							await unitChanged(this.state);
						}}
					/>
				</td>
				<td style={row_style}>
					<input
						style="width: 50px;"
						type="text"
						value={priority}
						placeholder="10"
						onChange={async e => {
							this.setState({ priority: e.target.value });
							await unitChanged(this.state);
						}}
					/>
				</td>
				<td style={row_style}>
					<a class="has-text-black" onClick={async e => {
						if (await clicked(content)) this.setState({ toggled: !toggled });
					}}>
						<span class="icon is-medium">
							<i class={icon}></i>
						</span>
					</a>
				</td>

			</tr>
		);
	}
}

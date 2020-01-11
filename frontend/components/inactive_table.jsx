import { h, render, Component } from 'preact';
import { connect } from 'unistore/preact';
import classNames from 'classnames';

import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

export default connect(storeKeys)(props => {
	const { content, clicked } = props;
	const list = content.map(item => <Inactive content={ item } clicked={ clicked } />);

	return (
		<div>
			<table className='table is-hoverable is-fullwidth'>
				<thead>
					<tr>
						<th style={ rowStyle }>{props.lang_table_distance}</th>
						<th style={ rowStyle }>{props.lang_table_population}</th>
						<th style={ rowStyle }>{props.lang_table_coordinates}</th>
						<th style={ rowStyle }>{props.lang_table_player}</th>
						<th style={ rowStyle }>{props.lang_table_village}</th>
						<th style={ rowStyle }>{props.lang_table_kingdom}</th>
						<th style={ rowStyle }>{props.lang_table_tribe}</th>
						<th />
					</tr>
				</thead>
				<tbody>{list}</tbody>
			</table>
		</div>
	);
});

class Inactive extends Component {
	state = {
		toggled: false,
	}

	tribe_dict = {
		'1': 'roman',
		'2': 'teuton',
		'3': 'gaul',
	}

	render({ content, clicked }, { toggled }) {
		const {
			distance, player_name, village_name,
			population, x, y, tribeId, kingdom_tag
		} = content;

		const coordinates = `( ${x} | ${y} )`;
		const tribe = this.tribe_dict[tribeId];

		const icon = classNames({
			'fas': true,
			'fa-lg': true,
			'fa-plus': !toggled,
			'fa-minus': toggled,
		});

		return (
			<tr>
				<td style={ rowStyle }>
					{ Number(distance).toFixed(1) }
				</td>
				<td style={ rowStyle }>
					{ population }
				</td>
				<td style={ rowStyle }>
					{ coordinates }
				</td>
				<td style={ rowStyle }>
					{ player_name }
				</td>
				<td style={ rowStyle }>
					{ village_name }
				</td>
				<td style={ rowStyle }>
					{ kingdom_tag }
				</td>
				<td style={ rowStyle }>
					{ tribe }
				</td>
				<td style={ rowStyle }>
					<a class="has-text-black" onClick={ async e => {
						if (await clicked(content)) this.setState({ toggled: !toggled });
					} }>
						<span class='icon is-medium'>
							<i class={ icon }></i>
						</span>
					</a>
				</td>
			</tr>
		);
	}
}

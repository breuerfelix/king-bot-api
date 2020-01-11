import { h } from 'preact';
import { connect } from 'unistore/preact';

import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

export default connect(storeKeys)(props => {
	const { content, clicked } = props;
	const list = content.map(item =>
		<Farmlist content={ item } clicked={ clicked } />
	);

	return (
		<div>
			<table className='table is-hoverable is-fullwidth'>
				<thead>
					<tr>
						<th style={ rowStyle }>{props.lang_table_farmlist}</th>
						<th style={ rowStyle }>{props.lang_table_village}</th>
						<th style={ rowStyle }>{props.lang_table_remove}</th>
					</tr>
				</thead>
				<tbody>{list}</tbody>
			</table>
		</div>
	);
});

const Farmlist = ({ content, clicked }) => (
	<tr>
		<td style={ rowStyle }>
			{content.farmlist}
		</td>
		<td style={ rowStyle }>
			{content.village_name}
		</td>
		<td style={ rowStyle }>
			<a class='has-text-black' onClick={ () => clicked(content) }>
				<span class='icon is-medium'>
					<i className='fas fa-lg fa-minus'></i>
				</span>
			</a>
		</td>
	</tr>
);

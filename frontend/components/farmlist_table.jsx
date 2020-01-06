import { h } from 'preact';
import { connect } from 'unistore/preact';

import { storeKeys } from '../language';

const rowStyle = {
	verticalAlign: 'middle',
	textAlign: 'center',
};

export default connect(storeKeys)(({ content, clicked }) => {
	const list = content.map(item =>
		<Farmlist content={ item } clicked={ clicked } />
	);

	return (
		<div>
			<table className='table is-hoverable is-fullwidth'>
				<thead>
					<tr>
						<th style={ rowStyle }>{this.props.lang_table_farmlist}</th>
						<th style={ rowStyle }>{this.props.lang_table_village}</th>
						<th style={ rowStyle }>{this.props.lang_table_remove}</th>
					</tr>
				</thead>
				<tbody>{list}</tbody>
			</table>
		</div>
	);
});

const Farmlist = ({ content: { farmlist, village_name }, clicked }) => (
	<tr>
		<td style={ rowStyle }>
			{farmlist}
		</td>
		<td style={ rowStyle }>
			{village_name}
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

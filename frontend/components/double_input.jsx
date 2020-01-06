import { h } from 'preact';

export default ({
	label, placeholder1, placeholder2,
	value1, value2, onChange1, onChange2,
	width = '120px',
}) => (
	<div style={{ margin: '1rem 0' }}>
		<label class='label'>{label}</label>
		<input
			class='input is-radiusless'
			type='text'
			style={{ width, marginRight: '10px' }}
			placeholder={ placeholder1 }
			value={ value1 }
			onChange={ onChange1 }
		/>
		<input
			class='input is-radiusless'
			type='text'
			style={{ width }}
			placeholder={ placeholder2 }
			value={ value2 }
			onChange={ onChange2 }
		/>
	</div>
);

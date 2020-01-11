import { h } from 'preact';

export default ({ label, placeholder, value, onChange }) => (
	<div style={{ margin: '1rem 0' }}>
		<label className='label'>{ label }</label>
		<div className='field has-addons'>
			<p className='control'>
				<input
					className='input'
					type='text'
					placeholder={ placeholder }
					value={ value }
					onChange={ onChange }
				/>
			</p>
		</div>
	</div>
);

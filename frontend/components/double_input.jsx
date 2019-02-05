import { h, render, Component } from 'preact';

export default class DoubleInput extends Component {
	render({ label, placeholder1, placeholder2, value1, value2, onChange1, onChange2 }) {
		return (
			<div style='margin-top: 1rem; margin-bottom: 1rem'>
				<label class="label">{ label }</label>
				<input
					class="input is-radiusless"
					type="text"
					style="width: 120px;margin-right: 10px;"
					placeholder={ placeholder1 }
					value={ value1 }
					onChange={ onChange1 }
				/>
				<input
					class="input is-radiusless"
					type="text"
					style="width: 120px;"
					placeholder={ placeholder2 }
					value={ value2 }
					onChange={ onChange2 }
				/>
			</div>
		);
	}
}

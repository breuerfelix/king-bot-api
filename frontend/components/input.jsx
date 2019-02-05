import { h, render, Component } from 'preact';

export default class Input extends Component {
	render({ label, placeholder, value, onChange }) {
		return (
			<div style='margin-top: 1rem; margin-bottom: 1rem'>
				<label class="label">{ label }</label>
				<div class="field has-addons">
					<p class="control">
						<input
							class="input"
							type="text"
							placeholder={ placeholder }
							value={ value }
							onChange={ onChange }
						/>
					</p>
				</div>
			</div>
		);
	}
}

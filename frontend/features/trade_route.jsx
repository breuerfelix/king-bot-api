import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';

export default class TradeRoute extends Component {
  state = {
    name: 'trade route',
    farmlists: [],
    selected_farmlist: '',
    origin_village_name: '',
    destination_village_name: '',
    interval_min: '',
    interval_max: '',
    wood: '',
    clay: '',
    iron: '',
    crop: '',
    all_farmlists: [],
    all_villages: [],
    error_input_min: false,
    error_input_max: false,
    error_origin_village: false,
    error_destination_village: false,
    error_wood: false,
    error_clay: false,
    error_iron: false,
    error_crop: false,

  }

  componentWillMount() {
    this.setState({
      ...this.props.feature
    });

    axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
  }


  submit = async e => {
    this.setState({
      error_input_min: (this.state.interval_min == ''),
      error_input_max: (this.state.interval_max == ''),
      error_origin_village: (this.state.origin_village_name == ''),
      error_destination_village: (this.state.destination_village_name == ''),
      error_wood: (this.state.wood = ''),
      error_clay: (this.state.clay = ''),
      error_iron: (this.state.iron = ''),
      error_crop: (this.state.crop = ''),
    });

    if (this.state.error_input_min || this.state.error_input_max || this.state.error_origin_village || this.state.error_destination_village ||
      this.state.error_wood || this.state.error_clay || this.state.error_iron || this.state.error_crop) return;

    this.props.submit({ ...this.state });
  }

  delete = async e => {
    this.props.delete({ ...this.state });
  }

  cancel = async e => {
    route('/');
  }

  render() {
    const { interval_min, interval_max, all_villages, origin_village_name, destination_village_name, wood, clay, iron, crop } = this.state;

    const input_class_min = classNames({
      input: true,
      'is-radiusless': true,
      'is-danger': this.state.error_input_min
    });

    const input_class_max = classNames({
      input: true,
      'is-radiusless': true,
      'is-danger': this.state.error_input_max
    });

    const village_select_class = classNames({
      select: true,
      'is-danger': this.state.error_origin_village
    });

    const wood_class = classNames({
      input: true,
      'is-radiusless': true,
      'is-danger': this.state.error_wood
    });

    const clay_class = classNames({
      input: true,
      'is-radiusless': true,
      'is-danger': this.state.error_clay
    });

    const iron_class = classNames({
      input: true,
      'is-radiusless': true,
      'is-danger': this.state.error_iron
    });

    const crop_class = classNames({
      input: true,
      'is-radiusless': true,
      'is-danger': this.state.error_crop
    });

    const villages = all_villages.map(village => <option value={village.data.name}>{village.data.name}</option>);
    return (
      <div>
        <div className="columns">

          <div className="column">

            <div class="field">
              <label class="label">select origin village</label>
              <div class="control">
                <div class={village_select_class}>
                  <select
                    class="is-radiusless"
                    value={origin_village_name}
                    onChange={(e) => this.setState({ origin_village_name: e.target.value })}
                  >
                    {villages}
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">select destination village</label>
              <div class="control">
                <div class={village_select_class}>
                  <select
                    class="is-radiusless"
                    value={destination_village_name}
                    onChange={(e) => this.setState({ destination_village_name: e.target.value })}
                  >
                    {villages}
                  </select>
                </div>
              </div>
            </div>

            <label style='margin-top: 2rem' class="label">interval in seconds (min / max)</label>
            <input
              class={input_class_min}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={interval_min}
              placeholder="min"
              onChange={(e) => this.setState({ interval_min: e.target.value })}
            />
            <input
              class={input_class_max}
              style="width: 150px;"
              type="text"
              value={interval_max}
              placeholder="max"
              onChange={(e) => this.setState({ interval_max: e.target.value })}
            />
            <p class="help">provide a number</p>

          </div>

          <div className="column">

            <label style='margin-top: 2rem' class="label">wood</label>
            <input
              class={wood_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={wood}
              placeholder="min"
              onChange={(e) => this.setState({ wood: e.target.value })}
            />
            <label style='margin-top: 2rem' class="label">clay</label>
            <input
              class={clay_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={clay}
              placeholder="min"
              onChange={(e) => this.setState({ clay: e.target.value })}
            />
            <label style='margin-top: 2rem' class="label">iron</label>
            <input
              class={iron_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={iron}
              placeholder="min"
              onChange={(e) => this.setState({ iron: e.target.value })}
            />
            <label style='margin-top: 2rem' class="label">crop</label>
            <input
              class={crop_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={crop}
              placeholder="min"
              onChange={(e) => this.setState({ crop: e.target.value })}
            />
          </div>

        </div>

        <div className="columns">
          <div className="column">
            <button className="button is-radiusless is-success" onClick={this.submit} style='margin-right: 1rem'>
              submit
						</button>
            <button className="button is-radiusless" onClick={this.cancel} style='margin-right: 1rem'>
              cancel
						</button>

            <button className="button is-danger is-radiusless" onClick={this.delete}>
              delete
						</button>
          </div>
          <div className="column">
          </div>
        </div>

      </div>
    );
  }
}

import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import axios from 'axios';
import classNames from 'classnames';

export default class TradeRoute extends Component {
  state = {
    name: 'trade route',
    farmlists: [],
    selected_farmlist: '',
    source_village_name: '',
    destination_village_name: '',
    interval_min: '',
    interval_max: '',
    send_wood: '',
    send_clay: '',
    send_iron: '',
    send_crop: '',
    source_wood: '',
    source_clay: '',
    source_iron: '',
    source_crop: '',
    destination_wood: '',
    destination_clay: '',
    destination_iron: '',
    destination_crop: '',
    all_farmlists: [],
    all_villages: [],
    error_input_min: false,
    error_input_max: false,
    error_source_village_name: false,
    error_destination_village: false
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
      error_source_village_name: (this.state.source_village_name == ''),
      error_destination_village_name: (this.state.destination_village_name == '')
    });

    if (this.state.error_input_min ||
      this.state.error_input_max ||
      this.state.error_source_village_name ||
      this.state.error_destination_village_name) return;

    this.props.submit({ ...this.state });
  }

  delete = async e => {
    this.props.delete({ ...this.state });
  }

  cancel = async e => {
    route('/');
  }

  render() {
    const { interval_min, interval_max, all_villages, source_village_name, destination_village_name,
      send_wood,
      send_clay,
      send_iron,
      send_crop,
      source_wood,
      source_clay,
      source_iron,
      source_crop,
      destination_wood,
      destination_clay,
      destination_iron,
      destination_crop } = this.state;

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

    const source_village_select_class = classNames({
      select: true,
      'is-danger': this.state.error_source_village_name
    });

    const destination_village_select_class = classNames({
      select: true,
      'is-danger': this.state.error_destination_village_name
    });

    const resource_class = classNames({
      input: true,
      'is-radiusless': true,
    });

    const villages = all_villages.map(village => <option value={village.data.name}>{village.data.name}</option>);
    return (
      <div>
        <div className="columns">

          <div className="column">

            <div class="field">
              <label class="label">select source village</label>
              <div class="control">
                <div class={source_village_select_class}>
                  <select
                    class="is-radiusless"
                    value={source_village_name}
                    onChange={(e) => this.setState({ source_village_name: e.target.value })}
                  >
                    {villages}
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">select destination village</label>
              <div class="control">
                <div class={destination_village_select_class}>
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

            <label style='margin-top: 2rem' class="label">Send (wood|clay|iron|crop)</label>
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={send_wood}
              placeholder="0"
              onChange={(e) => this.setState({ send_wood: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">clay</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={send_clay}
              placeholder="0"
              onChange={(e) => this.setState({ send_clay: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">iron</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={send_iron}
              placeholder="0"
              onChange={(e) => this.setState({ send_iron: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">crop</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={send_crop}
              placeholder="0"
              onChange={(e) => this.setState({ send_crop: e.target.value })}
            />

            <label style='margin-top: 2rem' class="label">When Source is greater than (wood|clay|iron|crop)</label>
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={source_wood}
              placeholder="0"
              onChange={(e) => this.setState({ source_wood: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">clay</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={source_clay}
              placeholder="0"
              onChange={(e) => this.setState({ source_clay: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">iron</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={source_iron}
              placeholder="0"
              onChange={(e) => this.setState({ source_iron: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">crop</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={source_crop}
              placeholder="0"
              onChange={(e) => this.setState({ source_crop: e.target.value })}
            />

            <label style='margin-top: 2rem' class="label">and Destination is less than (wood|clay|iron|crop)</label>
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={destination_wood}
              placeholder="10000000"
              onChange={(e) => this.setState({ destination_wood: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">clay</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={destination_clay}
              placeholder="10000000"
              onChange={(e) => this.setState({ destination_clay: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">iron</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={destination_iron}
              placeholder="10000000"
              onChange={(e) => this.setState({ destination_iron: e.target.value })}
            />
            {/* <label style='margin-top: 2rem' class="label">crop</label> */}
            <input
              class={resource_class}
              style="width: 150px;margin-right: 10px;"
              type="text"
              value={destination_crop}
              placeholder="10000000"
              onChange={(e) => this.setState({ destination_crop: e.target.value })}
            />

          </div>

          {/* <div className="column">

            
          </div> */}

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

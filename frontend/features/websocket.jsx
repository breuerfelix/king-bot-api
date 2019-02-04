import { h, render, Component } from 'preact';
import Websocket from 'react-websocket';
 
class WebsocketListener extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 90
    };
  }

  handleData(data) {
    let result = JSON.parse(data);
    this.setState({count: this.state.count + result.movement});
  }

  render() {
    return (
      <div>
        Count: <strong>{this.state.count}</strong>

        <Websocket url='https://com7.kingdoms.com/chat/socket.io/?EIO=3&transport=websocket&sid=wg3VrvMvX0lzpylSAY7e'
            onMessage={this.handleData.bind(this)}/>
      </div>
    );
  }
}

  export default WebsocketListener;
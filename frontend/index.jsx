import { h, render, Component } from 'preact';

class Clock extends Component {
    render() {
        let time = new Date().toLocaleTimeString();
        return <span>test</span>;
    }
}

// render an instance of Clock into <body>:
render(<Clock />, document.body);


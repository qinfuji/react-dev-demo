import React from 'react';
import { windowWhen } from 'rxjs/operator/windowWhen';

class Test1 extends React.Component {
  render() {
    return <div>test1</div>;
  }
}
class Test2 extends React.Component {
  render() {
    return <div>test2{this.props.children}</div>;
  }
}

function Test3() {
  return <div>Test3</div>;
}

export default class Root extends React.Component {
  render() {
    let path = decodeURIComponent(window.location.search);
    return (
      <div>
        <Test1 className={{ coloe: 'red' }} />
        <button>Button4</button>
        <Test1 />
        <Test2>{path}</Test2>
        <Test2 />
        <Test3 />
        <Test3 />
      </div>
    );
  }
}

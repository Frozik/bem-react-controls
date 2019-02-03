import React, { Component } from "react";
import { Input } from "./Components";
import "./App.scss";

class App extends Component<{}, { focused: boolean, value: string }> {
  state = { focused: false, value: "" };

  render() {
    return (
      <div className="App">
        <main>
          <article>
            <div>
              <Input />
              <Input focused={this.state.focused} onFocusChanged={(focused) => this.setState({ focused })}
                     value={this.state.value} onChange={(value) => this.setState({ value })}
              />
            </div>
          </article>
        </main>
      </div>
    );
  }
}

export default App;

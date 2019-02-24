import "./App.scss";

import React, { Component } from "react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore, Unsubscribe } from "redux";
import logger from "redux-logger";

import { Input, inputReducer } from "./components";

const store = createStore(combineReducers({
  firstInput: inputReducer,
}), applyMiddleware(logger));

class App extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { focused: false, value: "", focused2: false, value2: "123" };
    }

    private subscription: Unsubscribe | undefined;

    componentDidMount() {
        this.subscription = store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription();
        }
    }

    private readonly onFocusChanged1 = (focused: boolean) => this.setState({ focused });
    private readonly onFocusChanged2 = (focused: boolean) => this.setState({ focused2: focused });
    private readonly onValueChanged1 = (value: string) => this.setState({ value });
    private readonly onValueChanged2 = (value: string) => this.setState({ value2: value });

    render() {
      const { firstInput } = store.getState();

      return (
        <div className="App">
          <main>
            <article>
              <h1>Without redux store</h1>
              <div>
                <Input />
                <Input focused={this.state.focused} onFocusChanged={this.onFocusChanged1}
                      value={this.state.value} onValueChanged={this.onValueChanged1}
                />
              </div>
              <div>
                <Input />
                <Input focused={this.state.focused2} onFocusChanged={this.onFocusChanged2}
                      value={this.state.value2} onValueChanged={this.onValueChanged2}
                />
              </div>
            </article>
            <Provider store={store}>
            <article>
              <h1>With redux store</h1>
              <div>
                <Input useGlobalStore focused={firstInput.focused} value={firstInput.value} />
              </div>
            </article>
            </Provider>
          </main>
        </div>
      );
    }
}

export default App;

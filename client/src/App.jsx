import React, { Component } from "react";
import TodoListContract from "./contracts/TodoList.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { taskCount: 0, web3: null, accounts: null, contract: null, tasks: [] };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoListContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TodoListContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;

    // await contract.methods.createTask("Figure out Web3 FE").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.taskCount().call();

    const task1 = await contract.methods.tasks(1).call();

    console.log(task1);

    // Update state with the result.
    this.setState({ taskCount: response, tasks: [task1] });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    console.log(this.state.tasks);

    return (
      <div className="App">
        <h1>Ethereum Todo List</h1>
        <div>Total number of tasks: {this.state.taskCount}</div>
        <h2>Todos:</h2>
        <ul>
          {this.state.tasks.map(task => <li key={task.id}>{task.content}</li>)}
        </ul>
      </div>
    );
  }
}

export default App;
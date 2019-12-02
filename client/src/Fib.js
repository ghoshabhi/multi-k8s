import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ""
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const { data } = await axios.get("/api/values/current");
      this.setState({ values: data });
    } catch (err) {
      this.setState({ values: {} });
    }
  }

  async fetchIndexes() {
    const { data } = await axios.get("/api/values/all");
    if (!Array.isArray(data)) {
      this.setState({ seenIndexes: [] });
    } else {
      this.setState({ seenIndexes: data });
    }
  }

  handleSubmit = async event => {
    event.preventDefault();

    await axios.post("/api/values", {
      index: this.state.index
    });
    this.setState({ index: "" });
  };

  renderSeenIndexes() {
    const { seenIndexes } = this.state;

    if (!Array.isArray(seenIndexes) || seenIndexes.length === 0) {
      return <p>No indices seen so far...</p>;
    }

    return seenIndexes
      .map((seenIndex = {}) => seenIndex.number)
      .filter(Boolean)
      .join(", ");
  }

  renderValues() {
    const { values = {} } = this.state;
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key}, I calculated {values[key]}
        </div>
      );
    }

    if (entries.length === 0) {
      return <p>No values calculated so far...</p>;
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indices I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;

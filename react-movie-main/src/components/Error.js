import React, { Component } from 'react';
import './Error.css'

export default class Error extends Component {
  render() {
    return (
        <div className="error_container ">
        {this.props.error}
      </div>
    );
  }
}

// imports
import React from 'react';
import PropTypes from 'prop-types';

import './DotsLoader.css';

// react class
class DotsLoader extends React.Component {
  render() {
    let styles = {};

    if (this.props.size) {
      styles.width = this.props.size;
      styles.height = this.props.size;
    }
    if (this.props.color) {
      styles.backgroundColor = this.props.color;
    }
    if (this.props.spacing) {
      styles.margin = `0 ${this.props.spacing}px`;
    }
    return (
      <div className='dots-loader'>
        <div className='bounce1' style={styles}></div>
        <div className='bounce2' style={styles}></div>
        <div className='bounce3' style={styles}></div>
      </div>
    );
  }
}

// component meta
DotsLoader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  spacing: PropTypes.number
};

// expoerts
export default DotsLoader;
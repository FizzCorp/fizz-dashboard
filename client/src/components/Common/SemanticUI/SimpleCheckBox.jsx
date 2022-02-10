// imports
import React from 'react';
import PropTypes from 'prop-types';

// exports
export default class SimpleCheckBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { name, label, checked, style } = this.props;
    const nameComponentArr = this.getComponentNameParts();
    const className = nameComponentArr.join(' ');

    return (
      <div className={className} style={style}>
        <input
          name={name}
          type='checkbox'
          checked={checked}
          onChange={(event) => {
            this.props.handleOnChange(event.target.checked);
          }}
        />
        <label>{label}</label>
      </div>
    );
  }

  getComponentNameParts() {
    let nameComponentArr = ['ui', 'checkbox', `checkbox-${this.props.name}`];

    const type = this.props.type;
    if (type.length > 0) {
      nameComponentArr.splice(1, 0, type);
    }

    return nameComponentArr;
  }
}

// component meta
SimpleCheckBox.propTypes = {
  type: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,

  handleOnChange: PropTypes.func
};

SimpleCheckBox.defaultProps = {
  type: '',
  style: {},
  handleOnChange: (/* checked*/) => { }
};
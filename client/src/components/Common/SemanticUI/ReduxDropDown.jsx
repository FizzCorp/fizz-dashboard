// imports
import React from 'react';
import PropTypes from 'prop-types';
import SimpleDropDown from './SimpleDropDown.jsx';

// helper methods
function mapReduxFieldPropsToComponentProps(props) {
  const reduxInput = props.input;
  const selectedKey = reduxInput.value || '';
  const { hash, disabled, placeholder, placeholderSelected } = props;

  const componentProps = {
    hash,
    disabled,
    placeholder,
    placeholderSelected,

    name: reduxInput.name,
    selectedKey: (selectedKey.length > 0 && selectedKey) || undefined,

    handleOnChange: (value/* , text, choice*/) => {
      reduxInput.onChange(value);
    }
  };

  return componentProps;
}

// exports
const ReduxDropDown = (props) => {
  const componentProps = mapReduxFieldPropsToComponentProps(props);
  return (
    <SimpleDropDown
      {...componentProps}
    />
  );
};
export default ReduxDropDown;

// component meta
ReduxDropDown.propTypes = {
  disabled: PropTypes.bool,
  placeholderSelected: PropTypes.bool,

  hash: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired
};

ReduxDropDown.defaultProps = {
  disabled: false,
  placeholderSelected: true
};
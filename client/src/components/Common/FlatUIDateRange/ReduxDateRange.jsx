// imports
import React from 'react';
import FlatUIDateRange from './FlatUIDateRange.jsx';

// helper methods
function mapReduxFieldPropsToComponentProps(props) {
  const { input, defaultValue } = props;
  const inputValue = input.value || defaultValue;

  let inputValues = (inputValue.length > 0) ? inputValue.split(':') : ['', ''];
  inputValues = inputValues.map(i => parseInt(i));

  const componentProps = {
    id: input.name,
    end: inputValues[1],
    start: inputValues[0],

    handleOnChange: (startTS, endTS) => {
      let dateRangeValue = '';
      if (startTS && endTS) {
        dateRangeValue = `${startTS}:${endTS}`;
      }
      input.onChange(dateRangeValue);
    }
  };
  return componentProps;
}

// exports
const ReduxDateRange = (props) => {
  const componentProps = mapReduxFieldPropsToComponentProps(props);
  return (
    <FlatUIDateRange
      {...componentProps}
    />
  );
};
export default ReduxDateRange;
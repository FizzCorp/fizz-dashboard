// imports
import React from 'react';
import PropTypes from 'prop-types';

import { SEARCH_CHAT } from '../../../../../constants';
import SimpleDropDown from '../../../../Common/SemanticUI/SimpleDropDown.jsx';

// globals
const { AGE_HASH, SPENDER_HASH, PLATFORM_HASH, COUNTRY_HASH } = SEARCH_CHAT;
const SEGMENT_SELECTION_HASH = {
  age: { text: 'Age', hash: AGE_HASH },
  spender: { text: 'Spender', hash: SPENDER_HASH },
  platform: { text: 'Platform', hash: PLATFORM_HASH },
  countryCode: { text: 'Country', hash: COUNTRY_HASH },

  build: { text: 'Build' },
  custom01: { text: 'Custom01' },
  custom02: { text: 'Custom02' },
  custom03: { text: 'Custom03' }
};

const dropdownFilters = ['age', 'spender', 'platform', 'countryCode'];
const segmentTextProps = {
  type: 'text',
  name: 'segmentValue',
  placeholder: 'Please Enter'
};

const segmentValueProps = {
  removeable: false,
  name: 'segmentValueSelect',
  placeholderSelected: false,
  placeholder: 'Please Select'
};

const segmentSelectionProps = {
  placeholderSelected: false,
  name: 'segmentFilterSelect',
  hash: SEGMENT_SELECTION_HASH,
  placeholder: 'Select Segment'
};

// exports
export default class MetricSegment extends React.Component {
  constructor(props) {
    super(props);

    const segmentJson = props.segment || {};
    const selectedSegmentKey = Object.keys(segmentJson)[0];
    const selectedSegmentValue = segmentJson[selectedSegmentKey];

    this.state = {
      selectedSegmentKey: selectedSegmentKey,
      selectedSegmentValue: selectedSegmentValue
    };
  }

  // react lifecycle
  render() {
    const controlProps = this.getSegmentControlProps();
    const { superMenu, menu, textMenu } = controlProps;

    const menuVisible = (menu || textMenu);
    let marginClass = 'xlarge-0 xxlarge-2 x3-large-4 show-for-xxlarge columns';
    if (!menuVisible) {
      marginClass = 'small-0 xlarge-6 xxlarge-7 x3-large-8 show-for-xlarge columns';
    }

    return (
      <div className='row small-collapse xlarge-uncollapse'>
        <div className={marginClass} />
        <div className='small-12 xlarge-6 xxlarge-5 x3-large-4 columns' style={{ paddingRight: 0 }}>
          {superMenu && <SimpleDropDown {...superMenu} />}
        </div>
        <div className='small-1 hide-for-xlarge columns' style={{ marginBottom: 5 }}></div>
        {
          menuVisible &&
          <div className='small-12 xlarge-6 xxlarge-5 x3-large-4 columns' style={{ paddingRight: 0, marginBottom: 5 }}>
            {menu ? <SimpleDropDown {...menu} /> : <input {...textMenu} style={{ marginBottom: 0 }} />}
          </div>
        }
      </div>
    );
  }

  // control helpers
  getMenuProps() {
    const props = this.props;
    const { selectedSegmentKey, selectedSegmentValue } = this.state;
    const selectedSegmentHash = SEGMENT_SELECTION_HASH[selectedSegmentKey];

    const menuProps = {
      ...segmentValueProps,
      disabled: props.disabled,
      hash: selectedSegmentHash.hash,
      selectedKey: selectedSegmentValue,

      handleOnChange: (value/* , text, choice*/) => {
        const segmentJson = value ? { [selectedSegmentKey]: value } : undefined;
        this.setState({
          selectedSegmentValue: value,
          selectedSegmentKey: selectedSegmentKey
        });

        props.handleOnChange(segmentJson);
      }
    };

    return menuProps;
  }

  getTextMenuProps() {
    const props = this.props;
    const { selectedSegmentKey, selectedSegmentValue } = this.state;

    const textMenuProps = {
      ...segmentTextProps,
      disabled: props.disabled,
      value: selectedSegmentValue || '',

      onKeyUp: (event) => {
        event.preventDefault();
        event.stopPropagation();

        const valueIsValid = (selectedSegmentValue && selectedSegmentValue.length > 0);
        let valueUpdated = valueIsValid;

        const segmentParamJson = props.segment;
        if (segmentParamJson) {
          valueUpdated = segmentParamJson[selectedSegmentKey] !== selectedSegmentValue;
        }

        if (event.keyCode === 13 && valueUpdated) {
          const segmentJson = (valueIsValid) ? { [selectedSegmentKey]: selectedSegmentValue } : undefined;
          props.handleOnChange(segmentJson);
        }
      },
      onChange: (event) => {
        event.preventDefault();
        event.stopPropagation();

        let value = event.target.value;
        value = (value && value.length > 0) ? value : undefined;

        this.setState({ selectedSegmentValue: value });
      }
    };

    return textMenuProps;
  }

  getSuperMenuProps() {
    const props = this.props;
    const { selectedSegmentKey } = this.state;

    const superMenuProps = {
      ...segmentSelectionProps,
      disabled: props.disabled,
      selectedKey: selectedSegmentKey,

      handleOnChange: (value/* , text, choice*/) => {
        const selectedSegment = value ? value : undefined;
        this.setState({
          selectedSegmentValue: undefined,
          selectedSegmentKey: selectedSegment
        });

        if (props.segment) {
          props.handleOnChange(undefined);
        }
      }
    };

    return superMenuProps;
  }

  getSegmentControlProps() {
    const { selectedSegmentKey } = this.state;
    let controlProps = {
      superMenu: this.getSuperMenuProps()
    };

    let segmentValueKey = '';
    let segmentValueJson = undefined;
    if (selectedSegmentKey) {
      if (dropdownFilters.indexOf(selectedSegmentKey) !== -1) {
        segmentValueKey = 'menu';
        segmentValueJson = this.getMenuProps();
      }
      else {
        segmentValueKey = 'textMenu';
        segmentValueJson = this.getTextMenuProps();
      }
    }

    controlProps[segmentValueKey] = segmentValueJson;
    return controlProps;
  }
}

// component meta
MetricSegment.propTypes = {
  disabled: PropTypes.bool,
  segment: PropTypes.object,
  handleOnChange: PropTypes.func.isRequired
};
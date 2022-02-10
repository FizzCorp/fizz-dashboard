// imports
import React from 'react';

// exports
export default class TabHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { subSection, sectionHeading } = this.props;
    return (
      <div className='row collapse'>
        <div className='small-12 medium-2 columns'>
          <h3 className='ui left floated header'>{sectionHeading}</h3>
        </div>
        <div className='small-12 medium-10 columns'>
          {subSection && subSection}
        </div>
        <div className='small-12 columns'>
          <div className='ui divider' style={{ clear: 'both' }}></div>
        </div>
      </div>
    );
  }
}
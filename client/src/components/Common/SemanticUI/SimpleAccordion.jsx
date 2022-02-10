// imports
import React from 'react';
import PropTypes from 'prop-types';

// exports - SimpleAccordionSectionTitle
export class SimpleAccordionSectionTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const { textLeft, textRight } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <i className='dropdown icon'></i>
        <div className='content' style={{ width: '100%', position: 'relative', top: '-3px', display: 'flex', justifyContent: 'space-between' }}>
          <a className='header'>{textLeft}</a>
          {(textRight.length > 0) && <div className='description'>{textRight}</div>}
        </div>
      </div>
    );
  }
}

// component meta - SimpleAccordionSectionTitle
SimpleAccordionSectionTitle.propTypes = {
  textRight: PropTypes.string,
  textLeft: PropTypes.string.isRequired
};

SimpleAccordionSectionTitle.defaultProps = {
  textRight: ''
};

// exports - SimpleAccordion
export class SimpleAccordion extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.init();
  }

  render() {
    const { name, sections } = this.props;
    const sectionCells = sections.reduce((result, sectionMeta) => {
      const { id, title, content, isActive } = sectionMeta;
      const titleClass = isActive ? 'title active' : 'title';
      const contentClass = isActive ? 'content active' : 'content';

      result.push(<div key={`${id}-{title}`} className={titleClass}>{title}</div>);
      result.push(<div id={id} key={`${id}-content`} className={contentClass}>{content}</div>);

      return result;
    }, []);

    return (
      <div className={`ui accordion ${name}`}>{sectionCells}</div>
    );
  }

  // helper methods
  init() {
    const { name, duration, handleOnOpened, handleOnClosed, animateChildren } = this.props;
    $(`.ui.accordion.${name}`).accordion({
      duration,
      animateChildren,
      onOpen: function () {
        handleOnOpened(this.id);
      },
      onClose: function () {
        handleOnClosed(this.id);
      }
    });
  }
}

// component meta - SimpleAccordion
SimpleAccordion.propTypes = {
  duration: PropTypes.number,
  handleOnOpened: PropTypes.func,
  handleOnClosed: PropTypes.func,
  animateChildren: PropTypes.bool,

  name: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      isActive: PropTypes.bool,
      id: PropTypes.string.isRequired,
      title: PropTypes.element.isRequired,
      content: PropTypes.element.isRequired
    })
  ).isRequired
};

SimpleAccordion.defaultProps = {
  duration: 500,
  animateChildren: true,
  handleOnOpened: (/* sectionId*/) => { },
  handleOnClosed: (/* sectionId*/) => { }
};
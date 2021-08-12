import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import './Button.css';

function Button(props: InferProps<typeof Button.propTypes>) {
  const className: string = props.classNames
    ? props.classNames.join(' ') + ' default-button'
    : 'default-button';

  return (
    <button
      id={props.id ? props.id : undefined}
      className={className}
      onClick={props.onClick ? props.onClick : undefined}
      {...props.otherProps}
    >
      {props.text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string,
  id: PropTypes.string,
  classNames: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
  otherProps: PropTypes.object,
};

export { Button as Button };

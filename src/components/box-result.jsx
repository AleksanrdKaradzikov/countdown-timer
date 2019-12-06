import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';

const toTimeString = ({ minutes, seconds }) => {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const BoxResult = ({ seconds, minutes, persent }) => {
  return (
    <div className="result-box">
      <div className="result-box__progress">
        <Progress
          type="circle"
          width={180}
          format={() => {
            return <span className="result-box__time">{toTimeString({ minutes, seconds })}</span>;
          }}
          percent={persent}
        />
      </div>
    </div>
  );
};

BoxResult.defaultProps = {
  seconds: 0,
  minutes: 0,
  persent: 0,
};

BoxResult.propTypes = {
  seconds: PropTypes.number,
  persent: PropTypes.number,
  minutes: PropTypes.number,
};

export default BoxResult;

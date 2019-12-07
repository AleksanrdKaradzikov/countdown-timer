/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/sort-comp */
import React from 'react';
import { Button, Icon } from 'antd';

const toTimeString = ({ hours, minutes, seconds, msSeconds }) => {
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${msSeconds
    .toString()
    .padStart(2, '0')}`;
};

export default class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      msSeconds: 0,
      play: true,
      init: false,
    };
  }

  clearAll() {
    this.setState({
      hours: 0,
      minutes: 0,
      seconds: 0,
      msSeconds: 0,
      play: true,
      init: false,
    });
    cancelAnimationFrame(this.timerId);
  }

  stopTimer = event => {
    event.preventDefault();
    this.clearAll();
  };

  startTime = startDate => () => {
    const thisDate = new Date();
    let time = thisDate.getTime() - startDate.getTime();
    let msSeconds = time % 1000;
    time -= msSeconds;
    msSeconds = Math.floor(msSeconds / 10);
    time = Math.floor(time / 1000);
    const seconds = time % 60;
    time -= seconds;
    time = Math.floor(time / 60);
    const minutes = time % 60;
    time -= minutes;
    time = Math.floor(time / 60);
    const hours = time % 60;

    this.setState(
      {
        hours,
        minutes,
        seconds,
        msSeconds,
      },
      () => {
        this.timerId = requestAnimationFrame(this.startTime(startDate));
      }
    );
  };

  findTIME = event => {
    event.preventDefault();
    const { play, init } = this.state;
    if (play && !init) {
      this.startDate = new Date();
      this.timerId = requestAnimationFrame(this.startTime(this.startDate));
      this.setState({ play: false, init: true });
    } else if (play && init) {
      this.timerId = requestAnimationFrame(this.startTime(this.startDate));
      this.setState({ play: false });
    } else {
      cancelAnimationFrame(this.timerId);
      this.setState({ play: true });
    }
  };

  render() {
    const { hours, minutes, seconds, msSeconds, play } = this.state;
    const icon = play ? 'play-circle' : 'pause-circle';
    const time = toTimeString({ hours, minutes, seconds, msSeconds });
    return (
      <div className="timer-wrapper">
        <div className="timer-wrapper__result">
          <span className="time">{time}</span>
        </div>
        <div className="timer-wrapper__btns">
          <Button
            onClick={this.findTIME}
            className="timer-wrapper__btn timer-wrapper__btn--run"
            size="large"
            type="primary"
          >
            {
              <Icon
                type={icon}
                style={{ fontSize: '40px', color: '#1890FF', fontWeight: 'bold' }}
              />
            }
          </Button>
          <Button
            onClick={this.stopTimer}
            className="timer-wrapper__btn timer-wrapper__btn--reset"
            size="large"
            type="danger"
            htmlType="submit"
          >
            <Icon type="close-square" style={{ fontSize: '40px', color: 'rgb(230, 65, 65)' }} />
          </Button>
        </div>
      </div>
    );
  }
}

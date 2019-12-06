/* eslint-disable react/sort-comp */
/* eslint-disable id-length */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-param-reassign */
import React from 'react';
import StartForm from './start-form';
import BoxResult from './box-result';
import finishedSound from '../media/audio/finish-sound.mp3';

function validateControl(value, validation) {
  if (!validation) {
    return true;
  }

  let isValid = true;

  if (validation.minMinuts) {
    isValid = value >= validation.minMinuts && isValid;
  }

  if (validation.maxMin) {
    isValid = value <= validation.maxMin && isValid;
  }

  if (validation.minSeconds) {
    isValid = value >= validation.minSeconds && isValid;
  }

  if (validation.maxSecond) {
    isValid = value <= validation.maxSecond && isValid;
  }

  return isValid;
}

function returnFormattedToSeconds(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time - minutes * 60);

  return {
    minutes,
    seconds,
  };
}

export default class Countdown extends React.Component {
  constructor() {
    super();
    this.state = {
      inputDisabled: false,
      isStartValid: true,
      totalValueSlider: 0,
      formControl: {
        minutes: {
          value: 0,
          label: 'Минуты:',
          type: 'number',
          valid: true,
          min: 0,
          max: 720,
          touched: false,
          validation: {
            required: true,
            maxMin: 720,
            minMinuts: '0',
          },
        },
        seconds: {
          value: 0,
          label: 'Cекунды:',
          type: 'number',
          valid: true,
          min: 0,
          max: 59,
          touched: false,
          validation: {
            required: true,
            maxSecond: 59,
            minSeconds: '0',
          },
        },
      },
      timerData: {
        minutes: 0,
        seconds: 0,
        play: true,
        init: false,
        timerId: null,
        persent: 0,
        step: 0,
        totalTime: 0,
      },
    };
  }

  componentWillUnmount() {
    this.clearAll();
  }

  handleChangeInput = (value, controlName) => {
    if (controlName === 'slider') {
      const time = returnFormattedToSeconds(value);
      const step = 100 / (time.minutes * 60 + time.seconds);
      const newTotalTime = time.minutes * 60 + time.seconds;
      this.setState(({ timerData: newTimerData, formControl, totalValueSlider }) => {
        formControl.minutes.value = time.minutes;
        formControl.seconds.value = time.seconds;
        formControl.minutes.touched = true;
        formControl.seconds.touched = true;
        formControl.minutes.valid = true;
        formControl.seconds.valid = true;
        newTimerData.seconds = time.seconds;
        newTimerData.minutes = time.minutes;
        newTimerData.step = step;
        newTimerData.persent = 0;
        newTimerData.totalTime = newTotalTime;
        totalValueSlider = value;
        return {
          timerData: newTimerData,
          formControl,
          isStartValid: true,
          totalValueSlider,
        };
      });
      return;
    }

    if (Number.isNaN(value)) {
      return;
    }

    const formControl = { ...this.state.formControl };
    const control = { ...formControl[controlName] };
    const timerData = { ...this.state.timerData };

    control.value = value;
    control.touched = value > 0 || value === '' || value < 0;
    control.valid = validateControl(control.value, control.validation);
    formControl[controlName] = control;

    let isStartValid = true;

    Object.keys(formControl).forEach(name => {
      isStartValid = formControl[name].valid && isStartValid;
    });

    const key = controlName === 'minutes' ? 'minutes' : 'seconds';
    if (control.valid) {
      timerData[key] = +control.value;
    }

    timerData.step = 100 / (timerData.minutes * 60 + timerData.seconds);
    timerData.totalTime = timerData.minutes * 60 + timerData.seconds;
    timerData.persent = 0;

    this.setState({
      formControl,
      isStartValid,
      timerData,
      totalValueSlider: 0,
    });
  };

  clearAll = () => {
    clearTimeout(this.state.timerData.timerId);
    this.setState(({ formControl }) => {
      formControl.minutes.value = 0;
      formControl.minutes.valid = true;
      formControl.minutes.touched = false;
      formControl.seconds.value = 0;
      formControl.seconds.valid = true;
      formControl.seconds.touched = false;
      const newTimerData = {
        minutes: 0,
        seconds: 0,
        play: true,
        init: false,
        timerId: null,
        step: 0,
        totalTime: 0,
      };
      return {
        totalValueSlider: 0,
        inputDisabled: false,
        isStartValid: true,
        timerData: newTimerData,
        formControl,
      };
    });
  };

  startTime() {
    const { totalTime, step } = this.state.timerData;
    const time = returnFormattedToSeconds(totalTime);
    const timerData = { ...this.state.timerData };

    const timerId = setTimeout(() => this.startTime(), 1000);

    timerData.totalTime = totalTime - 1;
    timerData.seconds = time.seconds;
    timerData.minutes = time.minutes;
    timerData.persent = Number((timerData.persent + Number(step)).toFixed(2));
    timerData.timerId = timerId;

    this.setState({
      timerData,
    });

    if (totalTime === 0) {
      const finishedAudio = new Audio(finishedSound);
      finishedAudio.play();
      this.clearAll();
      this.setState(({ timerData: t }) => {
        t.persent = 100;
        return {
          timerData: t,
        };
      });
    }
  }

  clearFields() {
    clearTimeout(this.state.timerData.timerId);
    this.setState(({ timerData }) => {
      timerData.play = true;
      return {
        timerData,
      };
    });
  }

  findTime = () => {
    const { play, init, seconds, minutes } = this.state.timerData;
    if (seconds === 0 && minutes === 0) {
      alert('Введите время');
      return;
    }

    if (play && !init) {
      this.startTime();
      this.setState(({ formControl, timerData }) => {
        const newTimerData = { ...timerData };
        newTimerData.init = true;
        newTimerData.play = false;
        newTimerData.persent = 0;
        formControl.minutes.value = 0;
        formControl.seconds.value = 0;
        return {
          inputDisabled: true,
          formControl,
          timerData: newTimerData,
          totalValueSlider: 0,
        };
      });
    } else if (play && init) {
      this.startTime();
      this.setState(({ timerData }) => {
        timerData.play = false;
        return {
          timerData,
        };
      });
    } else {
      this.clearFields();
    }
  };

  render() {
    const { formControl, inputDisabled, isStartValid, totalValueSlider } = this.state;
    const { play, minutes, seconds, persent } = this.state.timerData;
    return (
      <div className="countdown-wrapper">
        <BoxResult minutes={minutes} seconds={seconds} persent={persent} />
        <StartForm
          formControl={formControl}
          inputDisabled={inputDisabled}
          handleChangeInput={this.handleChangeInput}
          isStartValid={isStartValid}
          totalValueSlider={totalValueSlider}
          play={play}
          findTime={this.findTime}
          clearAll={this.clearAll}
        />
      </div>
    );
  }
}

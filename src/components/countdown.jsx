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
        persent: 0,
        step: 0,
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
    timerData.persent = 0;

    this.setState({
      formControl,
      isStartValid,
      timerData,
      totalValueSlider: 0,
    });
  };

  clearAll = () => {
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
        step: 0,
        persent: 0,
      };
      return {
        totalValueSlider: 0,
        inputDisabled: false,
        isStartValid: true,
        timerData: newTimerData,
        formControl,
      };
    });
    clearInterval(this.timerId);
  };

  startTime() {
    this.timerId = setInterval(() => {
      const { step, seconds, minutes } = this.state.timerData;
      let newMin = minutes;
      let newSec = seconds;

      if (minutes === 0 && seconds === 0) {
        const finishedAudio = new Audio(finishedSound);
        finishedAudio.play();
        this.clearAll();
        return;
      }
      if (newSec === 0) {
        newSec = 59;
        newMin -= 1;
      } else {
        newSec -= 1;
      }

      this.setState(({ timerData }) => {
        timerData.seconds = newSec;
        timerData.minutes = newMin;
        timerData.persent += step;
        return {
          timerData,
        };
      });
    }, 1000);
  }

  clearFields() {
    clearInterval(this.timerId);
    this.setState(({ timerData }) => {
      timerData.play = true;
      return {
        timerData,
      };
    });
  }

  findTime = () => {
    const { play, init, seconds, minutes } = this.state.timerData;
    if (play && !init && (minutes > 0 || seconds > 0)) {
      const timerData = { ...this.state.timerData };
      const formControl = { ...this.state.formControl };
      const totalValueSlider = 0;
      formControl.minutes.value = 0;
      formControl.seconds.value = 0;
      timerData.play = false;
      timerData.init = true;
      this.setState(
        {
          formControl,
          timerData,
          totalValueSlider,
        },
        () => {
          this.startTime();
        }
      );
    }

    if (!play) {
      this.clearFields();
      return;
    }

    if (play && init) {
      const timerData = { ...this.state.timerData };
      timerData.play = false;
      this.setState(
        {
          timerData,
        },
        () => {
          this.startTime();
        }
      );
    }
  };

  render() {
    const { formControl, inputDisabled, isStartValid, totalValueSlider } = this.state;
    const { play, minutes, seconds, persent } = this.state.timerData;
    return (
      <div className="countdown-wrapper">
        <BoxResult minutes={minutes} seconds={seconds} persent={Math.floor(persent)} />
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

/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import { Button, Icon, Slider } from 'antd';
import PropTypes from 'prop-types';

const isInValid = (valid, touched, showldValidate) => {
  if (valid === false && showldValidate && touched) {
    return true;
  }
  return false;
};

class StartForm extends React.Component {
  handleSubmitForm = event => {
    event.preventDefault();
  };

  toConvertValue = value => {
    const mins = Math.floor(value / 60);
    const seconds = Math.round(value - mins * 60);
    return `${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  renderInputs() {
    const { formControl, inputDisabled, handleChangeInput } = this.props;
    return Object.keys(formControl).map((controlName, index) => {
      const control = formControl[controlName];
      const htmlFor = `control-${Math.random()}`;
      const inputClass = isInValid(control.valid, control.touched, !!control.validation)
        ? 'input input-invalid '
        : 'input';
      const labelClass = isInValid(control.valid, control.touched, !!control.validation)
        ? 'label label-invalid'
        : 'label';

      return (
        // eslint-disable-next-line react/no-array-index-key
        <label key={control + index} htmlFor={htmlFor} className={labelClass}>
          <span className="control-span">{control.label}</span>
          <input
            className={inputClass}
            type={control.type}
            value={control.value}
            min={control.min}
            max={control.max}
            id={htmlFor}
            required={control.validation.required}
            disabled={inputDisabled}
            onChange={event => handleChangeInput(event.target.value, controlName)}
          />
        </label>
      );
    });
  }

  renderSlider() {
    const { totalValueSlider, inputDisabled, handleChangeInput } = this.props;
    return (
      <Slider
        className="slider-input"
        min={0}
        max={3600}
        step={15}
        disabled={inputDisabled}
        onChange={value => handleChangeInput(value, 'slider')}
        value={totalValueSlider}
        tipFormatter={this.toConvertValue}
      />
    );
  }

  render() {
    const { play, isStartValid, findTime, clearAll } = this.props;
    const icon = play ? 'play-circle' : 'pause-circle';
    return (
      <form className="form-control" onSubmit={this.handleSubmitForm}>
        <h2 className="form-control__heading">Введите время:</h2>
        <div className="form-control__input-block">{this.renderInputs()}</div>
        <div className="form-control__slider-block">{this.renderSlider()}</div>
        <div className="form-control__buttons-block">
          <Button
            onClick={() => findTime()}
            disabled={!isStartValid}
            className="control-btn control-btn--run"
            size="large"
            type="primary"
          >
            {
              <Icon
                type={icon}
                style={{
                  fontSize: '40px',
                  color: `${isStartValid ? '#1890FF' : 'silver'}`,
                  fontWeight: 'bold',
                }}
              />
            }
          </Button>
          <Button
            onClick={() => clearAll()}
            className="control-btn control-btn--reset"
            size="large"
            type="danger"
            htmlType="submit"
          >
            <Icon type="close-square" style={{ fontSize: '40px', color: 'rgb(230, 65, 65)' }} />
          </Button>
        </div>
      </form>
    );
  }
}

StartForm.propTypes = {
  play: PropTypes.bool,
  isStartValid: PropTypes.bool,
  findTime: PropTypes.func,
  clearAll: PropTypes.func,
  totalValueSlider: PropTypes.number,
  inputDisabled: PropTypes.bool,
  handleChangeInput: PropTypes.func,
  formControl: PropTypes.object,
};

export default StartForm;

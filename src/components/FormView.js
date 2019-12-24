import React, { Component } from 'react'

export class FormView extends Component {
  yesOrNo = data => {
    return data ? 'Yes' : 'No'
  }

  onYearDataSwitch = event => {
    const year = parseInt(event.target.value);
    this.props.handleYearDataSwitch(year);
  }

  renderSelect = (onChange, name, options, currentValue) => {
    let value = (option) => name === 'year' ? parseInt(option) : option;
    return (
      <select name={name} onChange={onChange} value={currentValue}>
        {options.map(option =>
          <option key={option} value={value(option)}>
            {value(option)}
          </option>)}
      </select>
    )
  }

  render() {
    const { yearBasedSettingsData, currentYearSettings: 
      { agentName, returnRequired, extension, lLetter, dLetter },
    } = this.props;

    const getYears = yearBasedSettingsData && yearBasedSettingsData.map(data => data.year);

    return (
      <div>
        {this.renderSelect(this.onYearDataSwitch, 'year', getYears, this.props.currentYearSettings.year)}
        <hr />
        <section>
          <p>Agent Name: {agentName}</p>
          <p>Return Required: {this.yesOrNo(returnRequired)}</p>
          <p>Extension: {this.yesOrNo(extension)}</p>
          <p>D Letter: {this.yesOrNo(dLetter)}</p>
          <p>L Letter: {this.yesOrNo(lLetter)}</p>
        </section>
      </div>
    )
  }
}

export default FormView

import React, { Component } from 'react';
import axios from 'axios';

export class FormEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedCurrentYear: this.props.currentYearSettings
    }
  }

  yesOrNo = data => {
    return data ? 'Yes' : 'No'
  }

  handleChecked = (event) => {
    return this.yesOrNo(this.state.returnRequired) === event.target.value;
  }

  handleOptionChange = (event) => {
    const isYes = event.target.value === 'Yes' ? true : false;
    this.setState({
      updatedCurrentYear: {
        ...this.state.updatedCurrentYear,
        [event.target.name]: isYes
      }
    });
  }

  handleSelectChange = (event) => {
    this.setState({
      updatedCurrentYear: {
        ...this.state.updatedCurrentYear,
        [event.target.name]: event.target.name === 'year' ? parseInt(event.target.value) : event.target.value
      }
    });
  }

  handleYearChange = async (event) => {
    const year = parseInt(event.target.value);
    this.handleSelectChange(event);
    await this.props.handleYearDataSwitch(year);
    this.setState({
      updatedCurrentYear: this.props.currentYearSettings
    });
  }

  onSave = async () => {
    this.setState({
      updatedCurrentYear: {
        ...this.state.updatedCurrentYear,
        year: this.state.updatedCurrentYear.year,
        returnRequired: this.state.updatedCurrentYear.returnRequired,
        agentName: this.state.updatedCurrentYear.agentName,
        extension: this.state.updatedCurrentYear.extension,
        dLetter: this.state.updatedCurrentYear.dLetter,
        lLetter: this.state.updatedCurrentYear.lLetter
      }
    });
    
    const year = await this.state.updatedCurrentYear.year;
    const selectedId = (year) => {
      switch(year) {
        case 2019:
          return 1;
        case 2020:
          return 2;
        case 2021:
          return 3;
        default:
          return 1;
      }
    }

    await axios.put(`http://localhost:5555/yearBasedSettings/${selectedId(year)}`,   this.state.updatedCurrentYear);
    await this.props.handleSave(this.state.updatedCurrentYear);

    await this.props.handleModeSwitch();
  };

  onCancel = async () => {
    this.props.handleModeSwitch();
  };

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
    const { yearBasedSettingsData } = this.props;
    const { updatedCurrentYear: {
      year,
      returnRequired,
      agentName,
      extension,
      dLetter,
      lLetter,
    } } = this.state;
    
    const getAgents = yearBasedSettingsData.map(data => data.agentName);
    const getYears = yearBasedSettingsData.map(data => data.year);

    return (
      <div>
        <div>
          {this.renderSelect(this.handleYearChange, 'year', getYears, year)}
          <hr/>
          {this.renderSelect(this.handleSelectChange, 'agentName', getAgents, agentName)}
          <label>
            Retured Required
            <input
              type="radio"
              name="returnRequired"
              onChange={this.handleOptionChange}
              value={'Yes'}
              checked={this.yesOrNo(returnRequired) === 'Yes'}
            />
            <input
              type="radio"
              name="returnRequired"
              onChange={this.handleOptionChange}
              value={'No'}
              checked={this.yesOrNo(returnRequired) === 'No'}
            />
          </label>
          <label>
            Extension
            <input
              type="radio"
              name="extension"
              value={'Yes'}
              onChange={this.handleOptionChange}
              checked={this.yesOrNo(extension) === 'Yes'}
            />
            <input
              type="radio"
              name="extension"
              value={'No'}
              onChange={this.handleOptionChange}
              checked={this.yesOrNo(extension) === 'No'}
            />
          </label>
          <label>
            D Letter
            <input
              type="radio"
              name="dLetter"
              value={'Yes'}
              onChange={this.handleOptionChange}
              checked={this.yesOrNo(dLetter) === 'Yes'}
            />
            <input
              type="radio"
              name="dLetter"
              value={'No'}
              onChange={this.handleOptionChange}
              checked={this.yesOrNo(dLetter) === 'No'}
            />
          </label>
          <label>
            L Letter
            <input
              type="radio"
              name="lLetter"
              value={'Yes'}
              onChange={this.handleOptionChange}
              checked={this.yesOrNo(lLetter) === 'Yes'}
            />
            <input
              type="radio"
              name="lLetter"
              value={'No'}
              onChange={this.handleOptionChange}
              checked={this.yesOrNo(lLetter) === 'No'}
            />
          </label>
        </div>
        <div>
          <button onClick={this.onSave}>Save</button>
          <button onClick={this.onCancel}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default FormEdit

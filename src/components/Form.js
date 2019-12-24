import React, { Component } from 'react';
import axios from 'axios';
import FormEdit from "./FormEdit";
import FormView from "./FormView";
import { fetchWithTimeout } from "../utils/fetchHelper";

var compliance;

const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear;
}

export class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      isError: false,
      isLoading: false,
      errorMessage: '',
      currentYearSettings: {},
      yearBasedSettingsData: []
    }
  }

  async componentDidMount() {
    this.setState({
      isLoading: true
    });

    const promise = fetchWithTimeout(
      axios.get('http://localhost:5555/yearBasedSettings'),
      30000
    );

    promise.then(compliance => {
      compliance = compliance.data;
      if(compliance) {
        this.setState({
          currentYearSettings: this.getCurrentYearSettings(compliance),
          yearBasedSettingsData: compliance,
          isError: false,
          isLoading: false
        });
      } else {
        this.setState({
          isError: true,
          isLoading: false
        });
        throw new Error('timeout ..');
      }
    }).catch(error => {
      this.setState({
        isError: true,
        isLoading: false,
        errorMessage: error.toString()
      });
    });
    
  }

  getCurrentYearSettings = yearBasedSettings => {
    return yearBasedSettings.find(data => data.year === getCurrentYear());
  }

  handleModeSwitch = () => {
    this.setState(prevState => ({
      isEdit: !prevState.isEdit
    }));
  }

  handleYearDataSwitch = year => {
    const selectedYearData = compliance.find(data => data.year === parseInt(year));
    this.setState({
      currentYearSettings: selectedYearData
    });
  }

  handleSave = (incomeValues) => {
    this.setState({
      currentYearSettings: incomeValues
    });
  }

  render() {
    const {
      currentYearSettings,
      yearBasedSettingsData,
      isEdit,
      isError,
      isLoading,
      errorMessage
    } = this.state;

    return isError ? (<div><p>{errorMessage}</p></div>) : (
      !isLoading && <div>
        {!isEdit && <div><button onClick={this.handleModeSwitch}>Edit</button></div>}
        {
          isEdit ? (
            <FormEdit
              handleModeSwitch={this.handleModeSwitch}
              currentYearSettings={currentYearSettings}
              handleYearDataSwitch={this.handleYearDataSwitch}
              handleSave={this.handleSave}
              handleCancel={this.handleCancel}
              yearBasedSettingsData={yearBasedSettingsData}
            />
          ) : (
            <FormView
              handleYearDataSwitch={this.handleYearDataSwitch}
              currentYearSettings={currentYearSettings}
              yearBasedSettingsData={yearBasedSettingsData}
            />
          )
        }
      </div>
    )
  }
}

export default Form

import React from 'react';
import PropTypes from 'prop-types';


  class MapBoxAC extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error: false,
            errorMsg: '',
            queryResults: [],
            userInputValue: props.value,
            publicKey: props.publicKey,
            resetSearch: props.resetSearch ? props.resetSearch : false,
        }
    }

    updateQuery = (value) => {
      const { publicKey } = this.state;
        const header = { 'Content-Type': 'application/json' };
        let path = `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${publicKey}`;
        
    if(this.props.country) {
      path = `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${publicKey}&country=${this.props.country}`;
        
      }
    this.getResult(path, header);
    }

   
    getResult = (path, header) => {
        if(this.state.userInputValue.length > 2) {
            return fetch(path, {
              headers: header,
            }).then(res => {
              if (!res.ok) throw Error(res.statusText);
              return res.json();
            }).then(json => {
              console.log(json);
              this.setState({
                error: false,
                queryResults: json.features
              });
            }).catch(err => {
              this.setState({
                error: true,
                errorMsg: 'There was a problem retrieving data from mapbox',
                queryResults: []
              });
            })
          } else {
            this.setState({
              error: false,
              queryResults: []
            });
          }
    }

    resetSearch = () => {
        if(this.state.resetSearch) {
          this.setState({
            query: '',
            queryResults: []
          });
        } else {
          this.setState({ queryResults: [] });
        }
      }
    
      /**
       * @param {event} event
       */
      onSuggestionSelect = event => {
        if(this.state.resetSearch === false) {
          this.setState({ query: event.target.getAttribute('data-suggestion') });
        }
    
        this.props.onSuggestionSelect(
          event.target.getAttribute('data-suggestion'),
          event.target.getAttribute('data-lat'),
          event.target.getAttribute('data-lng'),
          event.target.getAttribute('data-text')
        )
      }


      getIsExpanded = () => {
        return this.state.userInputValue.length > 0;
      };

      clearQueryResults = () => {
          this.setState({ queryResults: [] })
      }

      handleInputChange = event => {
        
        const { value } = event.target;
        console.log(value);
        this.props.onChange(value);
        this.setState({ userInputValue: value });
        if (!value) {
          this.clearQueryResults();
          return;
        }
        this.updateQuery(value);
      };


      getInputProps = (options = {}) => {
        if (options.hasOwnProperty('value')) {
          throw new Error(
            '[react-places-autocomplete]: getInputProps does not accept `value`. Use `value` prop instead'
          );
        }
    
        if (options.hasOwnProperty('onChange')) {
          throw new Error(
            '[react-places-autocomplete]: getInputProps does not accept `onChange`. Use `onChange` prop instead'
          );
        }
    
        const defaultInputProps = {
          type: 'text',
          autoComplete: 'off',
          role: 'combobox',
          'aria-autocomplete': 'list',
          'aria-expanded': this.getIsExpanded(),
        };
    
        return {
          ...defaultInputProps,
          ...options,
          value: this.props.value,
          onChange: event => {
            this.handleInputChange(event);
          },
          onReset: () => {
            this.resetSearch();
          }
        };
      };

    render(){
      console.log(this.state.queryResults)
        return this.props.children({
            getInputProps: this.getInputProps,
            queryResults: this.state.queryResults,
            error: this.state.error,
            onSuggestionSelect: this.onSuggestionSelect
        });
    }
  }

  
  MapBoxAC.defaultProps = {
    inputId: null,
    inputOnFocus: null,
  };
  
  MapBoxAC.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    publicKey: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onSuggestionSelect: PropTypes.func.isRequired,
    country: PropTypes.string,
    userInputValue: PropTypes.string,
    resetSearch: PropTypes.bool
  }

  export default MapBoxAC;
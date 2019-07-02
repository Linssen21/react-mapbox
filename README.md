# React MapBox AutoComplete Beta

The project is still under development
### Implementation
```javascript
class TestComponent extends Component {

    state = {
        address: '',
    }
    suggestionSelect(result, lat, lng, text) {
      console.log(result, lat, lng, text)
    }
    handleChange = address => {
        this.setState({ address });
      };
      
    render() {
        return (
        <div>
            <MapBoxAC 
                publicKey='YOUR_API_KEY'
                value={this.state.address}
                onChange={this.handleChange}
                inputOnClick={this.onClick}
                onSuggestionSelect={this.suggestionSelect}
                resetSearch={false}
            >
           
            {({getInputProps, queryResults, error}) => (
                <div>
                    <input {...getInputProps({
                         placeholder: 'Search Places ...',
                         className: 'react-mapbox-ac-input'
                    })}/>
                    <div className='react-mapbox-ac-menu' style={ queryResults.length > 0 || error ? {display: 'block'} : {display: 'none'}}>
                    </div>
                    {
                        queryResults.map((place, index) => {
                            return(
                                <div className='react-mapbox-ac-suggestion' key={index}
                                data-suggestion={place.place_name}
                                data-lng={place.center[0]}
                                data-lat={place.center[1]}
                                data-text={place.text}>
                                     {place.place_name}
                                </div>
                            )
                        })
                    }
                </div>
            )}
             </MapBoxAC>
        </div>
        )
    }
}
```

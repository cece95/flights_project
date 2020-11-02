import React from 'react';


export class AirportSelector extends React.Component {
    state = {
        airports: []
    }


    componentDidMount(){
        fetch("http://localhost:5000/airports")
        .then((response) => {
            return response.json();
          })
          .then(data => {
            let airportsFromAPI = data["data"].map(airport => {
              return {value: airport, display: airport}
            });
            this.setState({
              airports: [{value: '', display: '(Select the Airport)'}].concat(airportsFromAPI)
            });
          }).catch(error => {
            console.log(error);
          });
    }

    render(){
        return (
            <div>
                <h3> {this.props.title} </h3>
              <select onChange={this.props.onChange}>
                {this.state.airports.map((airport) => <option key={airport.value} value={airport.value}>{airport.display}</option>)}
              </select>
            </div>
          )
    }
}
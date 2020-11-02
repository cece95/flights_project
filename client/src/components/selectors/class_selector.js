import React from 'react';

export class ClassSelector extends React.Component {
    state = {
        classes: []
    }


    componentDidMount(){
        fetch("http://localhost:5000/classes")
        .then((response) => {
            return response.json();
          })
          .then(data => {
            let airportsFromAPI = data["data"].map(c => {
              return {value: c, display: c}
            });
            this.setState({
              classes: [{value: '', display: '(Select the Flight Class)'}].concat(airportsFromAPI)
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
                {this.state.classes.map((c) => <option key={c.value} value={c.value}>{c.display}</option>)}
              </select>
            </div>
          )
    }
}
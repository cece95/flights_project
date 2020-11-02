import React from 'react';
import {AirportSelector} from './selectors/airport_selector'
import {Button, Container, Row, Col} from 'react-bootstrap';
import Spacer from './spacer'

export class FlightsToSweden extends React.Component {

    state = {
        percentage: null
    }

    componentDidMount() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            };
            
            fetch('http://localhost:5000/to_sweden', requestOptions)
            .then(response => response.json())
            .then(data => {
                var percentage = parseFloat(data.percentage).toFixed(2)
                this.setState({percentage:percentage})});
        }

    render() {
        const {percentage} = this.state
        var results = <div>
                <h4> The percentage of flights directed to Sweden was {percentage ? percentage : ""} </h4>
            </div> 

        return <Container>
            <h1> Calculate the percentages of flights that went to Sweden </h1>
            <Spacer height="10px"/>
            {percentage ? results : ""}
            </Container>
    }
}
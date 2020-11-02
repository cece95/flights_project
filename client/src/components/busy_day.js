import React from 'react';
import {AirportSelector} from './selectors/airport_selector'
import {Button, Container, Row, Col} from 'react-bootstrap';
import Spacer from './spacer'

export class BusyDay extends React.Component {
    constructor(props){
        super(props)
        this.state = {airport: null, date:null, count: null}
        this.handleAirportChange = this.handleAirportChange.bind(this)
        this.calculateResult = this.calculateResult.bind(this)
    }

    handleAirportChange(e){
        this.setState({airport: e.target.value})
    }

    calculateResult(){
        if (this.state.airport){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({airport: this.state.airport})
            };
            fetch('http://localhost:5000/busy_day', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({date: data.busy_day, count: data.departures_count}));
        }
    }


    render(){
        const {date, count} = this.state
        var results = <div>
                <h4> The busiest day for the {this.state.airport} airport was the {this.state.date} with a total number of departures of {this.state.count} </h4>
            </div> 

        return <Container>
            <Row><h1> Calculate which day had the most departures from an airport </h1> </Row>
            <Row className="justify-content-md-center"> <AirportSelector title="Airport" onChange={this.handleAirportChange}/> </Row>
            <Spacer height="10px"/>
            <Row className="justify-content-md-center"> <Button variant="light" onClick={this.calculateResult}> Calculate </Button> </Row>
            <Spacer height="10px"/>
            {date ? results : ""}
            </Container>
    }
}
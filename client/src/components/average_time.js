import React from 'react';
import {AirportSelector} from './selectors/airport_selector'
import {Button, Container, Row, Col} from 'react-bootstrap';
import Spacer from './spacer'

export class AverageTime extends React.Component {
    constructor(props){
        super(props)
        this.state = {departure: null, arrival: null, out_time: null, in_time: null}
        this.handleArrivalChange = this.handleArrivalChange.bind(this)
        this.handleDepartureChange = this.handleDepartureChange.bind(this)    
        this.calculateResult = this.calculateResult.bind(this)
    }

    handleDepartureChange(e){
        this.setState({departure: e.target.value})
    }

    handleArrivalChange(e){
        this.setState({arrival: e.target.value})
    }

    calculateResult(){
        console.log(this.state.departure)
        console.log(this.state.arrival)
        if (this.state.arrival && this.state.departure){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ departure: this.state.departure, arrival: this.state.arrival})
            };
            fetch('http://localhost:5000/average_time', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({out_time: data.average_time_outbound, in_time: data.average_time_inbound}));
        }
    }


    render(){
        const {out_time, in_time} = this.state
        var results = <Row>
                <Col> <h4> Average outbound time: {out_time ?  out_time.split(".")[0] : ""} </h4> </Col>
                <Col> <h4> Average inbound time: {in_time ?  in_time.split(".")[0] : ""} </h4> </Col>
            </Row> 

        return <Container>
            <Row><h1> Calculate the average travelling time between two locations</h1></Row>
            <Row>
            <Col> <AirportSelector title="Departure Airport" onChange={this.handleDepartureChange}/> </Col>    
            <Col> <AirportSelector  title="Arrival Airport" onChange={this.handleArrivalChange}/> </Col> 
            </Row>
            <Spacer height="10px"/>
            <Row className="justify-content-md-center"> <Button variant="light" onClick={this.calculateResult}> Calculate </Button> </Row>
            <Spacer height="10px"/>
            {out_time ? results : ""}
        </Container>
    }
}
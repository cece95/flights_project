import React from 'react';
import {AirportSelector} from './selectors/airport_selector'
import {Button, Container, Row, Col, Table} from 'react-bootstrap';
import Spacer from './spacer'

export class AverageCost extends React.Component {
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
            fetch('http://localhost:5000/average_cost', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({data: data.data}));
        }
    }


    render(){
        const {data} = this.state
        if (data) {
        var results = <Table striped bordered hover>
            <thead>
                <tr>
                    <th> Outbound flight class </th>
                    <th> Inbound flight class </th>
                    <th> Average Price </th>
                </tr>
            </thead>
            <tbody>
                {data.map(row => <tr>
                    <td> {row.outflightclass} </td>
                    <td> {row.inflightclass} </td>
                <td> {parseFloat(row.avg_price).toFixed(2)} {row.originalcurrency}</td>
                </tr>)}
            </tbody>
        </Table>
        }

        return <Container>
            <Row><h1> Calculate the average prices for flights between these airports by class </h1></Row>
            <Row>
            <Col> <AirportSelector title="Departure Airport" onChange={this.handleDepartureChange}/> </Col>    
            <Col> <AirportSelector  title="Arrival Airport" onChange={this.handleArrivalChange}/> </Col> 
            </Row>
            <Spacer height="10px"/>
            <Row className="justify-content-md-center"> <Button variant="light" onClick={this.calculateResult}> Calculate </Button> </Row>
            <Spacer height="10px"/>
            {data ? results : ""}
        </Container>
    }
}
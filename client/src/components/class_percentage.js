import React from 'react';
import { ClassSelector } from './selectors/class_selector';
import {Button, Container, Row, Col} from 'react-bootstrap';
import Spacer from './spacer'

export class ClassPercentage extends React.Component {
    constructor(props){
        super(props)
        this.state = {class_: null, percentage:null}
        this.handleClassChange = this.handleClassChange.bind(this)
        this.calculateResult = this.calculateResult.bind(this)
    }

    handleClassChange(e){
        this.setState({class_: e.target.value})
    }

    calculateResult(){
        if (this.state.class_){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({class: this.state.class_})
            };
            fetch('http://localhost:5000/class_percentage', requestOptions)
            .then(response => response.json())
            .then(data => {
                var percentage = parseFloat(data.percentage).toFixed(2)
                this.setState({percentage:percentage})});
        }
    }


    render(){
        const {class_, percentage} = this.state
        var results = <div>
                <h4> The percentage of flights of class {this.state.class_} in the dataset is {this.state.percentage}% </h4>
            </div> 

        return <Container>
            <h1> Calculate what percentage of flights in the dataset belongs to a specific class </h1>
            <Row className="justify-content-md-center"><ClassSelector title="Flight Class" onChange={this.handleClassChange}/> </Row>
            <Spacer height="10px"/>
            <Row className="justify-content-md-center"> <Button variant="light" onClick={this.calculateResult}> Calculate </Button> </Row>
            <Spacer height="10px"/>
            {percentage ? results : ""}
            </Container>
    }
}
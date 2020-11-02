# Flight data client and server

## Server
The server is built in python using the flask framework

### Install and run 

Requires python3 installed

Install the dependencies with
`pip3 install flask pandas flask-cors`

And then run with
`python index.py`

The server will run on port 5000 

### API

APIs 1 to 5 accept post requests and are used to answer the provided questions
APIS  6 and 7 accept get requests and are used to fill in the dropdown selectors

#### 1. Average time

`/average_time` 
Calculates the average duration of outbound and inbound flights between two airports

parameters: {departue, arrival} where departure and arrival are IATA codes of the departure and arrival airports
returns: {average_time_outbound, average_time_inbound} that are the average time of the outbound and inbound flight respectively

#### 2. Busy day

`/busy_day`
Calculates the busiest day of the selected airport and returns the number of departures from it on that day

parameters: {airport} the IATA code of the selected airport
returns: {airport, busy_day, departures_count} the IATA code of the airport, the date corresponding to the busiest day and the number of departures

#### 3. Class percentage
`/class_percentage`
Calculates the percentages of flights in the dataset that belong to a certain flight class

parameters: {class} The class that we are analysing
returns: {class, percentage} The selected class and the associated percentage

#### 4. Flights to sweden
`/to_sweden`
Calculates the percentages of flights in the dataset that went to Sweden

parameters: none
returns: {percentage} the percentage of flights that had sweden as destination

#### 5. Average flight cost by class 
`/average_cost`
Calculates the average flight cost between two airports, divided by flight class of the inbound and outbound flight class

parameters: {departue, arrival} where departure and arrival are IATA codes of the departure and arrival airports
returns: a json array containing the a list of the following if available {avg_price, inflightclass, originalcurrency, outflightclass} that represent the inbound and outbound flight classes, the average price and the corresponding currency

##### 6. Airports
`/airports`
Returns a list of all the IATA codes present in the dataset


#### 7. classes
`/classes`
Returns a list of all the possible flight classes present in the dataset


## Client

### Install and run 

Requires Nodejs and NPM installed

Install the dependencies with 
`npm install`

then run with
`npm run`
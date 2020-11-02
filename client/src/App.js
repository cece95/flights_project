import './App.css';
import {AverageTime} from './components/average_time'
import {BusyDay} from './components/busy_day'
import { ClassPercentage } from './components/class_percentage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/spacer'
import Spacer from './components/spacer';
import { FlightsToSweden } from './components/flights_to_sweden';
import { AverageCost } from './components/average_cost'

function App() {
  return (
    <div className="App">
      <AverageTime />
      <Spacer height="20px"/>
      <BusyDay />
      <Spacer height="20px"/>
      <ClassPercentage />
      <Spacer height="20px"/>
      <FlightsToSweden />
      <Spacer height="20px"/>
      <AverageCost />
    </div>
  );
}

export default App;

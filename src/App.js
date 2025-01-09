//import logo from './logo.svg';
import './App.css';
import { MonsContainer } from "./mons-container.js";







function App() {
  return (
    <div className="App" style={{height: "1000vh"}}>
      {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      */}
      <div className="attackers" ><MonsContainer sideCode={"attacker"}></MonsContainer></div>
      <div className="defenders" ><MonsContainer sideCode={"defender"}></MonsContainer></div>
      
    </div>
  );
}







export default App;

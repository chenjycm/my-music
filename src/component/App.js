import React, { Component } from 'react';
import MusicBox from './MusicBox';
import './App.scss';             //页面css
// import playimg from '../images/play.png';

class App extends Component {    //将播放器放入APP，在由app放入index
    
    componentDidMount(){
        console.log()
    }
    render() {
    return (
      <div className="App">
        {/* <div className="App-header">
          <img src={playimg} className="App-logo" alt="logo" />
          <h2>Let's Play Music!</h2>
        </div> */}
        <MusicBox />       
      </div>
    );
  }
}

export default App;
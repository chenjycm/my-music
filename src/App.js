import React, { Component } from 'react';
import './App.css';
import { Icon } from 'antd';
import 'antd/dist/antd.css';


class MusicInfo extends Component {
  
    render(){
        return (
            <div>
                <p className="music-name">
                    {this.props.name}
                </p>
                <p className="singer">
                    {this.props.artists}
                </p>
                <div className="music-pic">
                    <img src={this.props.img}/>
                </div>
            </div>
        )
    }
}
class MuiscTime extends Component {
    render(){
        return (
            <div className="timeline">
               <span>{this.props.currentTime}</span>
               <p className="progress"></p>
               <span>{this.props.currentTotalTime}</span>
            </div>
        )
    }
}

class MusicControl extends Component {   
  
    render(){
        
        const buttontypes = this.props.isPlay === false ? "play-circle-o" : "pause-circle-o";
        return (
            <div className="controler">
                <Icon type="fast-backward" className="n-p" onClick={this.props.onPrev} />
                <Icon type={buttontypes} className="play" onClick={this.props.onPlay} />
                <Icon type="fast-forward" className="n-p" onClick={this.props.onNext} />
            </div>
        )
    }
}

class MUsicBox extends Component {
    constructor(){
       super();
       this.state = {
          currentListIndex: 0, //初始化加载第一首歌曲
          currentTime: 0, //初始化当前播放时间为0
          currentTotalTime:0,  //初始化当前歌曲总时间0
          playStatus: false,   //播放状态，false表示已暂停，true表示正在播放
          lists: [{
            "name": "Yesterday Once More",
            "artists": "Carpenter",
            "img": "./images/1.jpg",
            "audio": "./music/yesterday.mp3"
            },
            {
            "name": "The Call",
            "artists": "Backstreet",
            "img": "./images/2.jpg",
            "audio": "./music/theCall.mp3"
            }],
       };
       this.play = this.play.bind(this);
       this.updatePlayStatus = this.updatePlayStatus.bind(this);
       this.previous = this.previous.bind(this);
       this.next = this.next.bind(this);
    }   
    updatePlayStatus(){     //根据状态来设置音乐播放还是暂停并且更新时间显示
        let audio = document.getElementById('audio');
        if(this.state.playStatus){
            audio.play();
        }else{
            audio.pause();
        }
        this.setState({
            currentTotalTime: this.state.lists[this.state.currentListIndex].duration / 1000
        });
    }
    play(){   //播放事件
        this.setState({
            playStatus: !this.state.playStatus            
        },()=>{this.updatePlayStatus()});
    }
    previous(){
        if(this.state.currentListIndex == 0){
            alert('That is the first!');
        }else{
            this.setState({
                currentListIndex : this.state.currentListIndex - 1,
            },()=>{this.updatePlayStatus()});
        }
    }
    next(){
        if(this.state.currentListIndex + 1 >= this.state.lists.length){
            alert('That is the last!');
        }else{
            this.setState({
                currentListIndex : this.state.currentListIndex + 1,
            },()=>{this.updatePlayStatus()});
        }
    }
    componentDidMount(){
        this.updatePlayStatus();
        setInterval(()=>{
            let audio = document.getElementById('audio');
            if( this.state.currentTime >= this.state.currentTotalTime ){
                this.next();
            };
        },300)
    }


    render(){       
        return (
            <div className="music-box">
                <MusicInfo info={this.state.lists[this.state.currentListIndex]} />
                <MuiscTime currentTime={this.state.currentTime} currentTotalTime={this.state.currentTotalTime}/>
                <MusicControl isPlay={this.state.playStatus} onPlay={this.play} onPrev={this.previous} onNext={this.next} />
                <audio id="audio" src={this.state.lists[this.state.currentListIndex].audio} ></audio>
            </div>
        );
    }
}

// MUsicBox.defaultProps = {
//    lists: [{
//       "name": "Yesterday Once More",
//       "artists": "Carpenter",
//       "img": "./images/1.jpg",
//       "audio": "./music/yesterday.mp3"
//     },
//     {
//       "name": "The Call",
//       "artists": "Backstreet",
//       "img": "./images/2.jpg",
//       "audio": "./music/theCall.mp3"
//     }]
// };
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={require('./images/play.png')} alt="music pictrue" className="App-logo" alt="logo" />
          <h2>Let's Play Music!</h2>
        </div>
        <MUsicBox />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
// import { Icon } from 'antd';
import Icon from 'antd/lib/icon';
import Slider from 'antd/lib/slider';
import 'antd/dist/antd.css';
import call from './music/thecall.mp3';
import yesterday from './music/yesterday.mp3';


class MUsicBox extends Component {
    constructor(){
       super();
       this.state = {
          currentListIndex: 0, //初始化加载第一首歌曲
          currentTime: 0, //初始化当前播放时间为0
          currentTotalTime: 3599,  //初始化当前歌曲总时间0
          playStatus: true,   //播放状态，false表示已暂停，true表示正在播放
          playVolume: 0.8, //音量
          lists: [{
            "name": "Yesterday Once More",
            "artists": "Carpenter",
            "img": "https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=e90d3e97d9b44aed4d43b6b6d275ec64/2fdda3cc7cd98d106efc31ec223fb80e7aec90c6.jpg",
            "audio": yesterday
            },
            {
            "name": "The Call",
            "artists": "Backstreet",
            "img": "http://img.eaymusic.com/forum/201506/14/132005m9qpda22eeuqzu6z.jpg",
            "audio": call
            }],
       };
       this.play = this.play.bind(this);
       this.updatePlayStatus = this.updatePlayStatus.bind(this);
       this.previous = this.previous.bind(this);
       this.next = this.next.bind(this);
       this.volumeChange=this.volumeChange.bind(this);
       this.proChange=this.proChange.bind(this);
       this.timeChange=this.timeChange.bind(this);
    }   
    updatePlayStatus(){     //根据状态来设置音乐播放还是暂停并且更新时间显示
        let audio = document.getElementById('audio');
        let vm = this; 
        //给audio添加侦听事件，待音频加载完成后读取总时间，但是尝试了onload等各种方法，duration读取始终有问题，无法达到加载完成后修改状态的效果
        //所以增加设置了循环读取，知道读取到值为止
        audio.addEventListener('onload',(function(){   
            if(isNaN(audio.duration)){
                let si = setInterval(()=>{
                    if(!isNaN(audio.duration)){
                        clearInterval(si);
                        vm.setState({
                            currentTotalTime: audio.duration
                        });
                    }
                },300);
            }else{
                vm.setState({
                    currentTotalTime: audio.duration
                });
            }
        })());
        // console.log(audio.duration);
        if(this.state.playStatus){
            audio.play();
        
        }else{
            audio.pause();
        }
        
    }
    play(){   //播放与暂停事件
        this.setState({
            playStatus: !this.state.playStatus            
        },()=>{this.updatePlayStatus()});
    }
    previous(){   //上一首
        if(this.state.currentListIndex === 0){
            // alert('已经是第一首了！');
            this.setState({
                playStatus: false,
               
            });
        }else{
            this.setState({
                currentListIndex : this.state.currentListIndex - 1,
                currentTime: 0
            },()=>{this.updatePlayStatus()});
        }
    }
    next(){     //下一首
        let audio = document.getElementById('audio');
        if(this.state.currentListIndex + 1 >= this.state.lists.length){
            // alert('已经是最后一首了！');
            this.setState({
                playStatus: false,
                currentTime: 0,
                currentListIndex: 0
            },()=>{this.updatePlayStatus()});
            audio.currentTime = 0;
        }else{
            this.setState({
                currentListIndex : this.state.currentListIndex + 1,
                currentTime: 0
            },()=>{this.updatePlayStatus()});
        }
    }
    volumeChange(value){
        let audio = document.getElementById('audio');
        this.setState({
            playVolume: value / 30 
        },function(){
            audio.volume=this.state.playVolume;
        });
    }
    proChange(value){
         let audio = document.getElementById('audio');        
         this.setState({
            playStatus: true
         },()=>{ audio.currentTime = value / 1000 * this.state.currentTotalTime;}); 
         audio.play();
    }
    timeChange(value){
        let audio = document.getElementById('audio');    
        audio.pause();
        audio.currentTime = value / 1000 * this.state.currentTotalTime;
        this.setState({
            currentTime: value / 1000 * this.state.currentTotalTime,
            playStatus: false
        });
    }
    componentDidMount(){            //页面渲染后更新状态
        this.updatePlayStatus();
        let audio = document.getElementById('audio');
           
        setInterval(()=>{
            if( this.state.currentTime >= this.state.currentTotalTime ){  //判断时间确定是否播放下一首歌
                this.next();
            }else{
                this.setState({
                    currentTime: audio.currentTime,
                    // currentTotalTime: audio.duration
                });
            }
        },300);
    }

    render(){       
        return (
            <div className="music-box">
                <MusicInfo info={this.state.lists[this.state.currentListIndex]} />
                <MuiscTime 
                    currentTime={this.state.currentTime} 
                    currentTotalTime={this.state.currentTotalTime} 
                    progress={this.state.currentTime / this.state.currentTotalTime}
                    proChange={this.proChange}
                    timeChange={this.timeChange}
                />
                <MusicControl 
                    isPlay={this.state.playStatus} 
                    onPlay={this.play} 
                    onPrev={this.previous} 
                    onNext={this.next}
                    volumeChange={this.volumeChange}
                />
                <audio id="audio" src={this.state.lists[this.state.currentListIndex].audio} >您的浏览器不支持 audio 标签。</audio>
            </div>
        );
    }
}

class MusicInfo extends Component {  //歌曲信息组件
    render(){       
        return (
            <div>
                <p className="music-name">
                    {this.props.info.name ? this.props.info.name : '未知曲名'}
                </p>
                <p className="singer">
                    {this.props.info.artists ? this.props.info.artists : '未知艺术家'}
                </p>
                <div className="music-pic">
                    <img src={this.props.info.img} alt="music-pic"/>
                </div>
            </div>
        )
    }
}
class MuiscTime extends Component {     //播放时间及进度
    converTime(times){
        let minutes = Math.floor(times/60);
        let seconds = Math.floor(times%60);
        if(minutes < 10 ){
            minutes = '0'+minutes;
        }
        if(seconds < 10){
            seconds = '0'+seconds;
        }
        return minutes+':'+seconds ;
    }
    render(){
        return (
            <div className="timeline">
               <span>{this.converTime(this.props.currentTime)}</span>
             
                    <div className="prodrag">
                        <Slider max={1000} value={this.props.progress * 1000} onChange={this.props.timeChange} onAfterChange={this.props.proChange} tipFormatter={false}/>
                    </div>
               
               <span>{this.converTime(this.props.currentTotalTime) }</span>                
            </div>
        )
    }
}

class MusicControl extends Component {   //播放器控制器  
    render(){        
        const buttontypes = this.props.isPlay === false ? "play-circle-o" : "pause-circle-o";
        return (
            <div className="controler">
                <div className="contrvo">
                    <Slider vertical defaultValue={24} max={30} onChange={this.props.volumeChange} />
                </div>
                <Icon type="fast-backward" className="n-p" onClick={this.props.onPrev} />
                <Icon type={buttontypes} className="play" onClick={this.props.onPlay} />
                <Icon type="fast-forward" className="n-p" onClick={this.props.onNext} />
            </div>
        )
    }
}

class App extends Component {    //将播放器放入APP，在由app放入index
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={require('./images/play.png')} className="App-logo" alt="logo" />
          <h2>Let's Play Music!</h2>
        </div>
        <MUsicBox />       
      </div>
    );
  }
}

export default App;
import React, { Component } from 'react';
import './App.css';             //页面css
import Icon from 'antd/lib/icon';       //引入播放按钮样式
import Slider from 'antd/lib/slider';   //引入滑动条样式
import 'antd/dist/antd.css';            //引入antd的css
import Music from './music.js';         //引入 音乐列表 ，将音乐列表独立出来，方便后台读取文件，不然要import很多文件


class MUsicBox extends Component {    //定义了一个音乐组件，其包含很多个子组件
    constructor(){
       super();
       this.state = {
          currentListIndex: 0, //初始化加载第一首歌曲
          currentTime: 0, //初始化当前播放时间为0
          currentTotalTime: 3599,  //初始化当前歌曲总时间0
          playStatus: true,   //播放状态，false表示已暂停，true表示正在播放
          playVolume: 0.8, //音量 最小是0 最大是1
          showList: false, //是否显示音乐列表
          lists: Music      //读取音乐列表到lists作为状态参数，正常应该设置为props参数，也可以在后面直接用Music（这里简化过程用了state，为了以后能够动态更新Music）
       };
       //父组件所有的操作都要绑定一下，不然this可能会有问题
       this.play = this.play.bind(this);
       this.updatePlayStatus = this.updatePlayStatus.bind(this);
       this.previous = this.previous.bind(this);
       this.next = this.next.bind(this);
       this.volumeChange=this.volumeChange.bind(this);
       this.proChange=this.proChange.bind(this);
       this.timeChange=this.timeChange.bind(this);
       this.changeDisplay=this.changeDisplay.bind(this);
       this.getListId=this.getListId.bind(this);
       this.hideList=this.hideList.bind(this);
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
                // playStatus: false, 
                currentListIndex: this.state.lists.length - 1              
            });
        }else{
            this.setState({
                currentListIndex : this.state.currentListIndex - 1,
                // currentTime: 0
            },()=>{this.updatePlayStatus()});
        }
    }
    next(){     //下一首
        let audio = document.getElementById('audio');
        if(this.state.currentListIndex + 1 >= this.state.lists.length){
            // alert('已经是最后一首了！');
            this.setState({
                // playStatus: false,
                currentTime: 0,
                currentListIndex: 0
            },()=>{this.updatePlayStatus()});
            // audio.currentTime = 0;
        }else{
            this.setState({
                currentListIndex : this.state.currentListIndex + 1,
                currentTime: 0
            },()=>{this.updatePlayStatus()});
        }
    }
    volumeChange(value){        // 修改音量
        let audio = document.getElementById('audio');
        this.setState({
            playVolume: value / 30 
        },function(){
            audio.volume=this.state.playVolume;
        });
    }
    proChange(value){    //进度条改变完成后开始从设置的位置播放
         let audio = document.getElementById('audio');        
         this.setState({
            playStatus: true
         },()=>{ 
             audio.currentTime = value / 2000 * this.state.currentTotalTime;
             audio.play();
            }
        );          
    }
    timeChange(value){      //进度条改变的时候，暂停播放，实时改变时间状态
        let audio = document.getElementById('audio');    
        audio.pause();
        audio.currentTime = value / 2000 * this.state.currentTotalTime;
        this.setState({
            currentTime: value / 2000 * this.state.currentTotalTime,
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
    changeDisplay(){   //点击列表菜单，修改列表状态为显示或隐藏
        this.setState({
            showList: !this.state.showList
        });
    }
    getListId(e){         //点击列表中的歌曲，并播放该歌曲，隐藏列表
        let a = e.target.getAttribute('data-id');
        this.setState({
            currentListIndex: a,
            showList: false        
        },()=>{
            this.updatePlayStatus();
        });
    }
    hideList(){
        this.setState({
            showList: false
        });
    }
    
    render(){       
        return (
            <div className="music-box">
                <Musiclist 
                    changeDisplay={this.changeDisplay}
                    showList={this.state.showList} 
                    lists={this.state.lists}
                    getListId={this.getListId}
                    currentListIndex={this.state.currentListIndex}
                    hideList={this.hideList}
                />
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
                <audio id="audio" src={this.state.lists[this.state.currentListIndex].audio} >您的浏览器不支持 audio 标签，无法播放。</audio>
                {/*<audio id="audio" src={Music.mylove} >您的浏览器不支持 audio 标签，无法播放。</audio>*/}
            </div>
        );
    }
}

class MusicInfo extends Component {  //歌曲信息组件
    render(){       
        return (
            <div className="music-info">
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
                        <Slider max={2000} value={this.props.progress * 2000} onChange={this.props.timeChange} onAfterChange={this.props.proChange} tipFormatter={false}/>
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

class Musiclist extends Component {  //播放列表组件。原本想把showList作为子组件的状态，把hideList设置为子组件方法，
    render(){                        //但是getListId需要更新歌曲还要隐藏列表设置状态showList,如果把showList从getListId剥离出来，
        return (                       //放在子组件，<li>点击事件需要执行两个事件，一个是更新父组件状态，二一个是更本组件状态，onClick写两个就有问题。
            <div className="musiclist">     
                <Icon type="bars" className="music-listbtn" onClick={this.props.changeDisplay}/>
                <ul id="lists" className={this.props.showList ? 'listshowing' : 'listhide'} onMouseLeave={this.props.hideList}>
                    {
                        this.props.lists.map((item)=>{
                            return (<li 
                                    className={(this.props.currentListIndex != item.id ) ? '' : 'active'} 
                                    data-id={item.id} 
                                    key={item.id} 
                                    onClick={this.props.getListId}>
                                    {item.name}-{item.artists}
                                    </li>
                                );
                            }
                        )
                    }                   
                </ul>
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
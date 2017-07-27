import React, { Component } from 'react';
import './App.css';             //页面css
import message from 'antd/lib/message';
import 'antd/dist/antd.css';            //引入antd的css
import Musiclist from './Musiclist.js';
import MusicInfo from './MusicInfo.js';
import MusicTime from './MusicTime.js';
import MusicControl from './MusicControl.js'
import Music from './music.js';         //引入 音乐列表 ，将音乐列表独立出来，方便后台读取文件，不然要import很多文件


class MusicBox extends React.Component {    //定义了一个音乐组件，其包含很多个子组件
    constructor(){
       super();
       this.state = {
          currentListIndex: 0, //初始化加载第一首歌曲
          currentTime: 0, //初始化当前播放时间为0
          currentTotalTime: 3599,  //初始化当前歌曲总时间0
          playStatus: true,   //播放状态，false表示已暂停，true表示正在播放
          playVolume: 0.5, //音量 最小是0 最大是1
          lists: Music      //读取音乐列表到lists作为状态参数，正常应该设置为props参数，也可以在后面直接用Music（这里简化过程用了state，为了以后能够动态更新Music）
       };
       //父组件所有的操作都要绑定一下，不然this可能会有问题
       this.updatePlayStatus = this.updatePlayStatus.bind(this);
       this.timeInterval = this.timeInterval.bind(this);
       this.play = this.play.bind(this);
       this.previous = this.previous.bind(this);
       this.next = this.next.bind(this);
       this.volumeChange = this.volumeChange.bind(this);
       this.proChange = this.proChange.bind(this);
       this.timeChange = this.timeChange.bind(this);
       this.getListId = this.getListId.bind(this);
       this.updateList = this.updateList.bind(this);
       this.deleteList = this.deleteList.bind(this);
    }   
   
    updatePlayStatus(){     //根据状态来设置音乐播放还是暂停并且更新时间显示
        let audio = this.refs.audio;
        if(this.state.playStatus){
            audio.play();
        
        }else{
            audio.pause();
        }        
    }
    timeInterval(){
        let audio = this.refs.audio;  
        this.timer = setInterval(()=>{
            if( this.state.currentTime >= this.state.currentTotalTime ){  //判断时间确定是否播放下一首歌
                this.next();
            }else{
                this.setState({
                    currentTime: audio.currentTime,
                });
            }
        },500);
    }
    play(){   //播放与暂停事件
        this.setState({
            playStatus: !this.state.playStatus            
        },()=>{this.updatePlayStatus()});
    }
    previous(){   //上一首
        
        if(this.state.currentListIndex === 0){
            message.warning('已是第一首歌，将跳转到最后一首！',1,()=>{
                this.setState({
                    currentListIndex: this.state.lists.length - 1 ,
                    currentTime: 0
                },()=>{this.updatePlayStatus()});
            });
        }else{
            this.setState({
                currentListIndex : this.state.currentListIndex - 1,
                currentTime: 0
            },()=>{this.updatePlayStatus()});
        }
    }
    next(){     //下一首
        if(this.state.currentListIndex + 1 >= this.state.lists.length){ 
            message.warning('已是最后一首歌，将跳转到第一首！',1,()=>{
                this.setState({
                    currentListIndex: 0,
                    currentTime: 0,
                    // playStatus: false
                },()=>{this.updatePlayStatus()});
            });
        }else{
            this.setState({
                currentListIndex : this.state.currentListIndex + 1,
                currentTime: 0
            },()=>{this.updatePlayStatus()});
        }
    }

    volumeChange(value){        // 修改音量
        let audio = this.refs.audio;
        this.setState({
            playVolume: value / 30 
        },function(){
            audio.volume=this.state.playVolume;
        });
    }
    proChange(value){    //进度条改变，完成后开始从设置的位置播放
         let audio = this.refs.audio;        
         this.setState({
            playStatus: true
         },()=>{ 
             audio.currentTime = value / 2000 * this.state.currentTotalTime;
             audio.play();
            }
        );          
    }
    timeChange(value){      //进度条改变的时候，暂停播放，实时改变时间状态
        let audio = this.refs.audio;  
        audio.pause();
        audio.currentTime = value / 2000 * this.state.currentTotalTime;
        this.setState({
            currentTime: value / 2000 * this.state.currentTotalTime,
            playStatus: false
        });
    }
   
    getListId(e){         //点击列表中的歌曲，并播放该歌曲，隐藏列表
        let a = e.getAttribute('data-id');
        let b = this.state.lists;
        for(let key in b){
            if(b[key].id == a){
                this.setState({
                      currentListIndex: +key,
                },()=>{ this.updatePlayStatus(); });
            }
        }
       
    }
    updateList(data){
        if(data){
            let nextlist = this.state.lists.slice(); //读取lists中的数组
            var ex = 0 ;
            for(let key in nextlist){
                if(nextlist[key].id === data.id){
                   ex++;
                }               
            }
            if(ex === 0){
                nextlist.push(data);   //新数组中插入数据
                this.setState({        
                    lists : nextlist,   //更新数组状态
                });
            }           
        }
    }
    deleteList(mid){
        if(this.state.lists.length > 1){
            let nextlist = this.state.lists.slice();
            for(let key in nextlist){
                if(nextlist[key].id == mid ){
                    nextlist.splice(key,1);                  
                    this.setState({        
                        lists : nextlist,   //更新数组状态
                    });
                }
            }
        }else{
             message.warning('留一首看家吧！',1);
        }
    }
    componentDidMount(){            //页面渲染后更新状态
        this.updatePlayStatus();
        let audio = this.refs.audio;    //新写法，尽量少对dom操作
        let vm = this; 
        this.timeInterval();
        audio.addEventListener('loadedmetadata',function(){  //添加侦听事件
            vm.setState({
                currentTotalTime: audio.duration
            },()=>audio.volume=vm.state.playVolume);
        });        

    }

    render(){       
        return (
            <div className="music-box" id="music-box" ref="musicbox">
                <Musiclist 
                    lists={this.state.lists}
                    getListId={this.getListId}
                    currentListIndex={this.state.currentListIndex}
                    hideList={this.hideList}
                    updateList={this.updateList}
                    deleteList={this.deleteList}
                />
                <MusicInfo info={this.state.lists[this.state.currentListIndex]} />
                <MusicTime 
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
               
                <audio id="audio" ref='audio' src={this.state.lists[+this.state.currentListIndex].audio} type="audio/mp4" >
                    您的浏览器不支持 "audio"标签，无法播放。
                </audio>
               
            </div>
        );
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
        <MusicBox />       
      </div>
    );
  }
}

export default App;
import React, { Component } from "react";
import { message } from "antd";
//引入自定义组件
import Musiclist from "./Musiclist";
import MusicInfo from "./MusicInfo.js";
import MusicTime from "./MusicTime.js";
import MusicControl from "./MusicControl.js";
//引入播放列表
import Music from "../music/music"; //引入 音乐列表 ，将音乐列表独立出来，方便后台读取文件，不然要import很多文件

class MusicBox extends Component {
    //定义了一个音乐组件，其包含很多个子组件
    constructor() {
        super();

        this.state = {            
            currentListIndex: 0, //初始化加载第一首歌曲
            currentTime: 0, //初始化当前播放时间为0
            currentTotalTime: 3600, //初始化当前歌曲总时间,取了一个大点的数据，以免加载过慢时显示总时间小于播放了的时间
            playStatus: true, //播放状态，false表示已暂停，true表示正在播放
            playVolume: 0.5, //音量 最小是0 最大是1
            lists: Music, //读取音乐列表到lists作为状态参数，正常应该设置为props参数，也可以在后面直接用Music（这里简化过程用了state，为了以后能够动态更新Music）
            randomPlay: false
        };
    } 
    componentDidMount() {
        //页面渲染后更新状态
        const {playVolume} = this.state;
        let audio = this.refs.audio; //尽量少对dom操作
        this.updatePlayStatus();
        this.timeMove();
        audio.addEventListener("loadedmetadata", () => {
            //添加侦听事件,当指定的音频/视频的元数据已加载时触发            
            this.setState({
                currentTotalTime: audio.duration
            },() => {                   
                audio.volume = playVolume
            });
        });
    }
    updatePlayStatus = () => {
        //根据状态来设置音乐播放还是暂停并且更新时间显示
        const {playStatus} = this.state;
        let audio = this.refs.audio;
        if (playStatus) {
            audio.play();
        } else {
            audio.pause();
        }
    };
    timeMove = () => {
        //更新时间，显示时间走动
        let audio = this.refs.audio;
        this.timer = setInterval(() => {
            if (this.state.currentTime >= this.state.currentTotalTime) {
                //判断时间确定是否播放下一首歌               
                this.next();
            } else {
                this.setState({
                    currentTime: audio.currentTime
                });
            }
        }, 500);
    };
    play = () => {
        //播放与暂停事件的切换
        this.setState({
            playStatus: !this.state.playStatus
        },() => {
            this.updatePlayStatus();
        });
    };
    previous = () => {
        //上一首
        const { currentListIndex, lists } = this.state;
        if (currentListIndex === 0) {
            message.warning("已是第一首歌，将跳转到最后一首！", 1, () => {
                this.setState({
                    currentListIndex: lists.length - 1,
                    currentTime: 0
                },() => {
                    this.updatePlayStatus();
                });
            });
        } else {
            this.setState({
                currentListIndex: currentListIndex - 1,
                currentTime: 0
            },() => {
                this.updatePlayStatus();
            });
        }
    };
    getRandom = (len, oldIndex) => {
        let newIndex =  Math.floor(Math.random()*len);
        if(newIndex != oldIndex){
            return newIndex
        }else{
            this.getRandom(len, oldIndex);
        }
    }
    next = () => {
        //下一首
        const { currentListIndex, lists, randomPlay } = this.state;
        if(randomPlay & lists.length > 0){
            this.setState({
                currentListIndex: this.getRandom(lists.length, currentListIndex),
                currentTime: 0
            },() => {
                this.updatePlayStatus();
            });           
        }else{
            if (currentListIndex + 1 >= lists.length) {
                clearInterval(this.timer);
                message.warning("已是最后一首歌，将跳转到第一首！", 1, () => {
                    this.setState({
                        currentListIndex: 0,
                        currentTime: 0,                   
                    },() => {
                        this.timeMove();
                        this.updatePlayStatus();
                    });
                });
            } else {
                this.setState({
                    currentListIndex: currentListIndex + 1,
                    currentTime: 0
                },() => {
                    this.updatePlayStatus();
                });
            }
        }
    };

    volumeChange = value => {
        // 修改音量
        const { playVolume } = this.state;
        let audio = this.refs.audio;
        this.setState({
            playVolume: value / 30
        },() => {
            audio.volume = playVolume;
        });
    };
    proChange = value => {
        //进度条改变，完成后开始从设置的位置播放
        const { currentTotalTime } = this.state;
        let audio = this.refs.audio;
        this.setState({
            playStatus: true
        },() => {
            audio.currentTime = value / 2000 * currentTotalTime;
            audio.play();
        });
    };
    timeChange = value => {
        //进度条改变的时候，暂停播放，实时改变时间状态
        const { currentTotalTime } = this.state;
        let audio = this.refs.audio;
        audio.pause();
        audio.currentTime = value / 2000 * currentTotalTime;
        this.setState({
            currentTime: value / 2000 * currentTotalTime,
            playStatus: false
        });
    };

    getListId = e => {
        //点击列表中的歌曲，并播放该歌曲，隐藏列表
        const { lists } = this.state;
        let a = e.getAttribute("data-id");
        for (let key in lists) {
            if (lists[key].id == a) {
                this.setState({
                    currentListIndex: +key
                },() => {
                    this.updatePlayStatus();
                });
            }
        }
    };
    updateList = data => {
        const { lists } = this.state;
        if (data) {
            let nextlist = lists.slice(); //读取lists中的数组
            let ex = 0;
            for (let key in nextlist) {
                if (nextlist[key].id === data.id) {
                    ex++;
                }
            }
            if (ex === 0) {
                nextlist.push(data); //新数组中插入数据
                this.setState({
                    lists: nextlist //更新数组状态
                });
            }
        }
    };
    deleteList = mid => {
        const { lists } = this.state;
        if (lists.length > 1) {
            let nextlist = lists.slice();
            for (let key in nextlist) {
                if (nextlist[key].id == mid) {
                    nextlist.splice(key, 1);
                    this.setState({
                        lists: nextlist //更新数组状态
                    });
                }
            }
        } else {
            message.warning("留一首看家哈！", 1);
        }
    };
    playTypeChange = () => {
        const {randomPlay} = this.state;
        this.setState({
            randomPlay: !randomPlay
        })
    }
    render() {
        const { lists, currentListIndex, currentTime, currentTotalTime, playStatus} = this.state;
        return (
            <div className="music-box" id="music-box" ref="musicbox">
                <Musiclist
                    lists={lists}
                    getListId={this.getListId}
                    currentListIndex={currentListIndex}
                    hideList={this.hideList}
                    updateList={this.updateList}
                    deleteList={this.deleteList}
                />
                <MusicInfo info={lists[currentListIndex]} />
                <MusicTime
                    currentTime={currentTime}
                    currentTotalTime={currentTotalTime}
                    progress={currentTime / currentTotalTime}
                    proChange={this.proChange}
                    timeChange={this.timeChange}
                />
                <MusicControl
                    isPlay={playStatus}
                    onPlay={this.play}
                    onPrev={this.previous}
                    onNext={this.next}
                    volumeChange={this.volumeChange}
                    playTypeChange={this.playTypeChange}
                />
                <audio
                    id="audio"
                    ref="audio"
                    src={lists[currentListIndex].audio}
                    type="audio/mp4"
                >
                    您的浏览器已经古董啦，请使用最新版现代浏览器。
                </audio>
            </div>
        );
    }
}

export default MusicBox;
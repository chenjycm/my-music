
import React, { Component } from 'react';
import Slider from 'antd/lib/slider';   //引入滑动条样式

class MusicTime extends Component {     //播放时间及进度
    converTime(times){              //将时间长度转化为时间格式
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

export default MusicTime;
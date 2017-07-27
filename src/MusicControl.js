import React, { Component } from 'react';
import Slider from 'antd/lib/slider';   //引入滑动条样式
import Icon from 'antd/lib/icon';       //引入播放按钮样式

class MusicControl extends Component {   //播放器控制器  
    render(){        
        const buttontypes = this.props.isPlay === false ? "play-circle-o" : "pause-circle-o";
        return (
            <div className="controler">
                <div className="contrvo">
                    <Slider vertical defaultValue={15} max={30} onChange={this.props.volumeChange} />
                </div>
                <Icon type="fast-backward" className="n-p" onClick={this.props.onPrev} />
                <Icon type={buttontypes} className="play" onClick={this.props.onPlay} />
                <Icon type="fast-forward" className="n-p" onClick={this.props.onNext} />                
            </div>
        )
    }
}

export default MusicControl;
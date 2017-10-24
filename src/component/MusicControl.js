import React, { Component } from 'react';
import {Slider, Icon, Switch} from 'antd';   //引入antd模块

class MusicControl extends Component {   //播放器控制器  
    render(){
        const {volumeChange, onPrev, onPlay, onNext, playTypeChange} = this.props;
        const buttontypes = this.props.isPlay === false ? "play-circle-o" : "pause-circle-o";
        return (
            <div className="controler">
                <div className="contrvo">
                    <Slider vertical defaultValue={15} max={30} onChange={volumeChange} />
                </div>
                <Icon type="fast-backward" className="n-p" onClick={onPrev} />
                <Icon type={buttontypes} className="play" onClick={onPlay} />
                <Icon type="fast-forward" className="n-p" onClick={onNext} />  
                <Switch className="playType" checkedChildren="随机" unCheckedChildren="顺序" onChange={playTypeChange} size="small"/>
            </div>
        )
    }
}

export default MusicControl;
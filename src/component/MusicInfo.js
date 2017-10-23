import React, { Component } from 'react';
import tempimg from '../images/temp.png'

class MusicInfo extends Component {  //歌曲信息组件
    render(){ 
        const {info} = this.props;    
        return (
            <div className="music-info">
                <p className="music-name">
                    {info != null ? info.name : 'Sample'}
                </p>
                <p className="singer">
                    {info != null ? info.artists : 'Sample'}
                </p>
                <div className="music-pic">
                    <img src={info != null ? info.img : tempimg} alt="music-pic"/>
                </div>
            </div>
        )
    }
}

export default MusicInfo;
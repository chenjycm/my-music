
import React, { Component } from 'react';

class MusicInfo extends Component {  //歌曲信息组件
    render(){       
        return (
            <div className="music-info">
                <p className="music-name">
                    {this.props.info != null ? this.props.info.name : 'Sample'}
                </p>
                <p className="singer">
                    {this.props.info != null ? this.props.info.artists : 'Sample'}
                </p>
                <div className="music-pic">
                    <img src={this.props.info != null ? this.props.info.img : require("./images/temp.png")} alt="music-pic"/>
                </div>
            </div>
        )
    }
}

export default MusicInfo;
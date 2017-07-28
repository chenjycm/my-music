import React, { Component } from 'react';
import axios from 'axios';
import Icon from 'antd/lib/icon';       //引入播放按钮样式
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
class Musiclist extends Component {  //播放列表组件。
    constructor(props){
        super(props);
        this.state = {
            showList: false,
            listshow: false,
            serchshow: false,
            serchresult: ''
        }
        this.listDisplay = this.listDisplay.bind(this);
        this.hideList = this.hideList.bind(this);
        this.searchDisplay=this.searchDisplay.bind(this);
        this.searchMusic=this.searchMusic.bind(this);
        this.addMusic=this.addMusic.bind(this);
        this.closeList=this.closeList.bind(this);
        this.doNotDo=this.doNotDo.bind(this);
        this.delList=this.delList.bind(this);
    }
    listDisplay(){   //点击列表菜单，修改列表状态为显示或隐藏
        this.setState({
            showList: !this.state.showList,
            listshow: true,
            serchshow: false
        });
    }
    searchDisplay(){
        this.setState({
            showList: !this.state.showList,
            listshow: false,
            serchshow: true
        });         
    }
    hideList(e){
        const event = e.target.parentNode;
        this.setState({
            showList: false
        },this.props.getListId(event));     //在子组件中调用父组件的方法，修改父组件的状态
        
    }
    searchMusic(name){
        let vm = this;
        if(name){
            axios.get('https://route.showapi.com/213-1?showapi_appid=42818&showapi_sign=fec952c9ebbb40399437efcff818f458&keyword='+name+'&page=1&')
            .then(function(res){
                let data = res.data.showapi_res_body.pagebean.contentlist;
                vm.setState({
                    serchresult: data,
                });
            })
            .catch(function(err){
                console.log(err);
            })
        }else{
             message.warning('未输入搜索内容！',2,)
        }
    }
    addMusic(e){
        let m = e.target.parentNode;
        let n = {
            "id": m.getAttribute('data-id'),
            "name": m.getAttribute('data-name'),
            "artists": m.getAttribute('data-artists'),
            "img": m.getAttribute('data-img'),
            "audio": m.getAttribute('data-audio'),
        }
        this.props.updateList(n);
        e.target.remove();
    }
    closeList(){
        this.setState({
            showList: false           
        });
    }
    doNotDo(e){         //阻止冒泡，实现点击list框内不隐藏
        e.nativeEvent.stopImmediatePropagation();
    }
    componentDidMount(){
        document.onclick = this.closeList;   //添加点击document 关闭list框
    }
    delList(e){
        let id = e.target.parentNode.getAttribute('data-id');
        this.props.deleteList(id);
    }
    render(){          
        const musiclist = this.props.lists.map((item,index)=>{
            return (<li 
                    className={(this.props.currentListIndex != index ) ? '' : 'active'} 
                    data-id={item.id} 
                    key={item.id} 
                   >
                    <span className="musictitle" onClick={this.hideList}>{item.name}-{item.artists}</span>
                    <Icon type="minus-circle-o" className="listsbtn" onClick={this.delList} />
                    </li>
                );
            }
        );
        const Search = Input.Search;
        const slist = this.state.serchresult ?
            this.state.serchresult.map((item)=>{
                    return (
                        <li
                            key={item.songid}
                            data-id={item.songid}
                            data-name={item.songname}
                            data-artists={item.singername}
                            data-img={item.albumpic_big}
                            data-audio={item.m4a}                                        
                            >
                            <span>{item.songname}-{item.singername}</span><Icon type="plus-circle-o" className="listsbtn" onClick={this.addMusic} />
                        </li>
                    )
                })
            : '';
                        
        const searchlist = (
            <div>
                <Search 
                    className="serchinput"
                    placeholder="输入歌曲名或者歌手名"
                    onSearch={ value => this.searchMusic(value) }
                    />
                {slist}
            </div>
        ); 
        return (                      
            <div className="musiclist" onClick={this.doNotDo}>     
                <Icon type="bars" className="music-listbtn" onClick={this.listDisplay}/>                
                <Icon type="search" className="music-search" onClick={this.searchDisplay}/>
               
                    <div id="lists" className={this.state.showList ? 'listshowing' : 'listhide'} >
                        <Icon type="close-circle-o" className="closeList" onClick={this.closeList} />
                        <ul>{
                            this.state.listshow ? musiclist : searchlist
                        }
                        </ul>                   
                    </div>
                
            </div>
        )
    }
}

export default Musiclist;
import React, { Component } from 'react';
import axios from 'axios';
import {Icon, Input, message} from 'antd';   


const Search = Input.Search;

class Musiclist extends Component {  //播放列表组件。
    constructor(props){
        super(props);
        this.state = {
            showList: false,    //显示列表框
            listshow: false,     //显示播放列表内容
            searchshow: false,    //显示搜索列表内容
            searchresult: ''       //存储搜索结果
        }       
    }

    componentDidMount(){
        document.onclick = this.closeList;   //添加点击document 关闭list框
    }
    listDisplay = () => {   //点击列表菜单，修改列表状态为显示或隐藏
        this.setState({
            showList: !this.state.showList,
            listshow: true,
            searchshow: false
        });
    }
    searchDisplay = () => {
        this.setState({
            showList: !this.state.showList,
            listshow: false,
            searchshow: true
        });         
    }
    hideList = (e) => {
        const event = e.target.parentNode;
        this.setState({
            showList: false
        },this.props.getListId(event));     //在子组件中调用父组件的方法，修改父组件的状态
        
    }
    searchMusic = (name) => {
        let vm = this;
        if(name){
            axios.get('https://route.showapi.com/213-1?showapi_appid=42818&showapi_sign=fec952c9ebbb40399437efcff818f458&keyword='+name+'&page=1&')
            .then(function(res){
                let data = res.data.showapi_res_body.pagebean.contentlist;
                vm.setState({
                    searchresult: data,
                });
            })
            .catch(function(err){
                console.log(err);
            })
        }else{
             message.warning('未输入搜索内容！',2,)
        }
    }
    addMusic = (e) => {
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
    closeList = () => {
        this.setState({
            showList: false           
        });
    }
    doNotDo = (e) => {         //阻止冒泡，实现点击list框内不隐藏
        e.nativeEvent.stopImmediatePropagation();
    }
    delList = (e) => {
        let id = e.target.parentNode.getAttribute('data-id');
        this.props.deleteList(id);
    }
    render(){          
        const {searchresult, showList, searchshow, listshow} = this.state;
        const {lists, currentListIndex} = this.props;
        const musiclist = lists && lists.map((item,index)=>{
            return (<li 
                    className={(currentListIndex != index ) ? '' : 'active'} 
                    data-id={item.id} 
                    key={item.id} 
                   >
                    <span className="musictitle" onClick={this.hideList}>{item.name}-{item.artists}</span>
                    <Icon type="minus-circle-o" className="listsbtn" onClick={this.delList} />
                    </li>
                );
            }
        );       
        const slist = searchresult ?
            searchresult.map((item)=>{
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
                {slist}
            </div>
        ); 
        return (                      
            <div className="musiclist" onClick={this.doNotDo}>     
                <Icon type="bars" className="music-listbtn" onClick={this.listDisplay}/>                
                <Icon type="search" className="music-search" onClick={this.searchDisplay}/>
               
                    <div id="lists" className={showList ? 'listshowing' : 'listhide'} >
                        
                        { searchshow ?  <Search 
                            className="serchinput"
                            placeholder="输入歌曲名或者歌手名"
                            onSearch={ value => this.searchMusic(value) }
                            /> : <Icon type="close-circle-o" className="closeList" onClick={this.closeList} />
                        }
                        <ul>{
                            listshow ? musiclist : searchlist
                        }
                        </ul>                   
                    </div>
                
            </div>
        )
    }
}

export default Musiclist;
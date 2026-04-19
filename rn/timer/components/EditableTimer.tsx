import React from 'react';

import TimerForm from "./TimerForm";
import Timer from "./Timer";


type Props = {
    id: string,
    title:string,
    project:string,
    elapsed:number,
    isRunning?:boolean,
    onFormSubmit:(attrs:Time)=>void,
    onRemovePress:(id:string)=>void,
    onStartPress:(id:string)=>void,
    onStopPress:(id:string)=>void,
};

// type TimerFormProps = {
//     id?: string,
//     title?:string,
//     project?:string,
//     onFormClose?:()=>void,
//     onFormSubmit:(attrs:Time)=>void,
//     onRemovePress:()=>void,
// }

type State = {
      editFormOpen?: boolean,
};

type Time = {
  id: string,
  title:string,
  project:string,
  elapsed:number,
  isRunning?:boolean,
}

export default class EditableTimer extends React.Component<Props,State>{

    state = {
        editFormOpen:false,
    };

    handleEditPress = () =>{
        this.setState({editFormOpen:true});
    };

    handleFormClose = ()=>{
        this.setState({editFormOpen:false});
    };

     handleUpdateSubmit = (attrs:Time) => {
        this.props.onFormSubmit(attrs);
        this.setState({editFormOpen:false});
    }

    render () {

    const {id,title,project,elapsed,isRunning,onRemovePress,onStartPress,onStopPress} = this.props;
    const {editFormOpen} = this.state;

    if(editFormOpen) {
        return <TimerForm 
                    id={id} 
                    title={title} 
                    project={project} 
                    onFormSubmit={this.handleUpdateSubmit} 
                    onFormClose={this.handleFormClose} 
                    />
    }
    return <Timer 
                id={id} 
                title={title} 
                project={project} 
                elapsed={elapsed} 
                isRunning={isRunning} 
                onEditPress={this.handleEditPress} 
                onRemovePress={onRemovePress}
                onStartPress={onStartPress}
                onStopPress={onStopPress}
                />
}}

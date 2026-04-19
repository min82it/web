import React from 'react';
import {StyleSheet,View} from 'react-native';

import TimerButton from './TimerButton';
import TimerForm from './TimerForm';

type State = {
    isOpen: boolean,
}

type Props  = {
    onFormSubmit:(attrs:Time) => void;
    onRemovePress:(timerId:string)=>void,
}

type Time = {
  id: string,
  title:string,
  project:string,
  elapsed:number,
  isRunning?:boolean,
}

export default class ToggleableForm extends React.Component<Props,State>{
    state = {isOpen: false};
    

    handleFormSubmit = (attrs:Time) => {
        this.props.onFormSubmit(attrs);
        this.setState({isOpen:false});
    }
    
    handleFormOpen = ()=>{
        this.setState({isOpen:true});
    }

    handleFormClose = () =>{
        this.setState({isOpen:false});
    };
    


    render(){
        const {isOpen} = this.state;
        const {onRemovePress} = this.props;

    return (
        <View style={[styles.container, !isOpen && styles.buttonPadding]}>
            {isOpen 
            ? 
            <TimerForm 
                onFormSubmit={this.handleFormSubmit}
                onFormClose={this.handleFormClose}
                onRemovePress={onRemovePress}
            /> 
            : 
            <TimerButton title='+' color='black' onPress={this.handleFormOpen}/>}
        </View>
    );
}}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    buttonPadding:{
        paddingHorizontal: 15,
    },
})


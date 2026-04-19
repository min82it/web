import React from 'react';
import {StyleSheet,View, Text} from 'react-native';

import TimerButton from './TimerButton';

type Props = {
    id: string,
    title:string,
    project:string,
    elapsed:number,
    editFormOpen?: boolean,
    isRunning?:boolean,
    onEditPress:()=>void,
    onRemovePress:(id:string)=>void,
    onStartPress:(id:string)=>void,
    onStopPress:(id:string)=>void,
}

const styles = StyleSheet.create({
    timerContainer:{
        backgroundColor: 'white',
        borderColor: '#d6d7da',
        borderWidth: 2,
        borderRadius: 10,
        padding: 15,
        margin: 15,
        marginBottom: 0,
    },
    title:{
        fontSize: 14,
        fontWeight: 'bold',
    },
    elapsedTime:{
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 15,
    },
    buttonGroup:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

export default class Timer extends React.Component<Props> {
    constructor(props:Props){
        super(props)
}

handleRemove = () => {
    const {id, onRemovePress} = this.props;
    onRemovePress(id);
}

handleStartPress = ()=>{
    const {id, onStartPress} = this.props;
    onStartPress(id);
}

handleStopPress = ()=>{
    const {id, onStopPress} = this.props;
    onStopPress(id);
}

renderActionButton = ()=>{
    const {isRunning} = this.props;
    if(isRunning){
        return (<TimerButton 
            title='Stop' 
            color='#db2828'
            onPress={this.handleStopPress}  
            />)
    }
    return (<TimerButton 
            title='Start' 
            color='#21ba45'
            onPress={this.handleStartPress}  
            />)
} 

render(){
    const { title,project,elapsed,onEditPress} = this.props;
    const milisecondsToHumen = (elapsed:number)  => {
        let seconds = elapsed / 1000;
        return seconds.toString(); 
    }
    return (
        <View style={styles.timerContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text>{project}</Text>
            <Text style={styles.elapsedTime}>{milisecondsToHumen(elapsed)}</Text>
            <View style={styles.buttonGroup}>
                <TimerButton title='Edit' color='blue' small onPress={onEditPress}/>
                <TimerButton title='Remove' color='blue' small onPress={this.handleRemove}/>
            </View>
            {this.renderActionButton()}
        </View>
    );
}   }
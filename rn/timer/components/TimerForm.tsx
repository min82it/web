import React from 'react';
import {Text,View,TextInput,StyleSheet} from 'react-native';

import TimerButton from './TimerButton';

// type Props = {
//     id?: string,
//     title?:string,
//     project?:string,
//     small?: boolean,
//     onFormSubmit?:(attrs:Time)=>void,
//     onFormClose?:()=>void,
//     onRemovePress:(id:string)=>void,
//     onStartPress:(id:string)=>void,
//     onStopPress:(id:string)=>void,

// }

type TimerFormProps = {
    id?: string,
    title?:string,
    project?:string,
    onFormClose:()=>void,
    onFormSubmit:(attrs:Time)=>void,
    onRemovePress?:(timerId:string)=>void,
}

type State ={
    title: string|undefined,
    project: string|undefined,
}


type Time = {
  id: string,
  title:string,
  project:string,
  elapsed:number,
  isRunning?:boolean,
}

const styles = StyleSheet.create({
    fromContainer:{
        backgroundColor:'white',
        borderColor: '#d6d7da',
        borderWidth: 2,
        borderRadius: 10,
        padding: 15,
        margin: 15,
        marginBottom: 0,
    },
    attributeContainer:{
        marginVertical:8,
    },
    textInputContainer:{
        borderColor:'#d6d7da',
        borderRadius: 2,
        borderWidth: 1,
        marginBottom: 5,
    },
    textInputTitle:{
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textInput:{
        height: 30,
        padding: 5,
        fontSize: 12,
    },
    submitText:{},
    cancel:{},
    buttonGroup:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

export default class TimerForm extends React.Component<TimerFormProps,State>{
    constructor(props:TimerFormProps){
        super(props);
        const {id=null,title='',project=''} = this.props;

        this.state = {
            title: id ? title : '',
            project: id ? project : '',
        }
        
    }
    
    handleTitleChange = (title:string) =>{
        this.setState({title})
    };
    
    handleProjectChange = (project:string) =>{
        this.setState({project})
    };
    
    handleSubmit = () =>{
        const {onFormSubmit,id} = this.props;
        const {title, project} = this.state;
        if(onFormSubmit){
            onFormSubmit({
                id:id||'',
                title:title||'',
                project:project||'',
                elapsed:0,
            });
        }
    }


    render() {
        const {id,onFormClose} = this.props;
        const {title, project} = this.state;
        const submitText = id ? `Update` : `Create`;
        
    return (
        <View style={styles.fromContainer}>
            <View style={styles.attributeContainer}>
                <Text style={styles.textInputTitle}>Title</Text>
                <View style={styles.textInputContainer}>
                    <TextInput 
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                        value={title}
                        onChangeText={this.handleTitleChange}
                        />
                </View>
            </View>      
            <View style={styles.attributeContainer}>
                <Text style={styles.textInputTitle}>Project</Text>
                <View style={styles.textInputContainer}>
                    <TextInput 
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                        value={project}
                        onChangeText={this.handleProjectChange}
                    />
                </View>
            </View> 
            <View style={styles.buttonGroup}>
                <TimerButton small color="#21BA45" title={submitText} onPress={this.handleSubmit} />
                <TimerButton small color="#DB2828" title="Cancel" onPress={onFormClose} />
            </View>    
        </View>

    )
}}


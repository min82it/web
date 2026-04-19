import { StyleSheet,Text,TouchableOpacity } from "react-native";
import React from 'react';

type Props = {
    title: string,
    color: string,
    small?: boolean,
    onPress?: ()=>void,
}

type Time = {
  id: string,
  title:string,
  project:string,
  elapsed:number,
  isRunning?:boolean,
}

export default function TimerButton (props:Props){
    const {title, color,small=false,onPress} = props;
    return (
        <TouchableOpacity style={[styles.button,{borderColor: color}]} onPress={onPress}>
            <Text style={[styles.buttonText,small?styles.small:styles.large,{color:color}]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles=StyleSheet.create({
    button:{
        marginTop: 10,
        minWidth: 100,
        borderWidth: 2,
        borderRadius: 3,
    },
    buttonText:{
        fontWeight: 'bold',
        textAlign: 'center',
    },
    small:{
        fontSize: 14,
        padding: 5,
    },
    large:{
        fontSize: 16,
        padding: 10,
    },
    title:{
        fontSize: 14,
        fontWeight: 'bold',
    },
    elapsedTime:{
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10,
    }
})
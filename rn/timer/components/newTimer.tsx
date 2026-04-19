import React from 'react';
import { View,StyleSheet,Text } from 'react-native';
import uuid from 'react-native-uuid'

type Props = {
    title?: string,
    project?:string,
}

export const newTimer = ({title, project}:Props={}) => {
    const timer = {
        title: title || 'Timer',
        project: project || 'Project',
        id: uuid.v4() as string,
        elapsed: 0,
        isRunning: false,
    };
    return timer;
}
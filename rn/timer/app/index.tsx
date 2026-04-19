import React from "react";
import { StyleSheet, ScrollView, Text, View, KeyboardAvoidingView } from "react-native";
import uuid from 'react-native-uuid';


import TimerButton from "../components/TimerButton";
import EditableTimer from "../components/EditableTimer";
import ToggleableForm from "../components/ToggleableForm";
import TimerForm from "@/components/TimerForm";
import { newTimer } from "@/components/newTimer";



type State = {
  timers: Time[],
}

type Time = {
  id: string,
  title:string,
  project:string,
  elapsed:number,
  isRunning?:boolean,
}

export default class Index extends React.Component<{},State> {

  intervalID?:ReturnType<typeof setInterval>;

  state: State = {
    timers:[{
      title: 'Mow the lawn',
      project: 'House Chores',
      id: uuid.v4() as string,
      elapsed: 5456099,
      isRunning: true,
    },{
      title: 'Bake Squash',
      project: 'Kitchen Chores',
      id: uuid.v4() as string,
      elapsed: 3890985,
      isRunning: false,
    }],
  } 
  
  handleCreateFormSubmit = (attrs: Time)=>{
    const {timers} = this.state;
    this.setState({
      timers:[newTimer({title:attrs.title,project:attrs.project}), ...timers],
    });
  }
  
   handleUpdateFormSubmit = (attrs:Time)=>{
    const {timers} = this.state;
    this.setState({
      timers:timers.map(timer=>{
        if(timer.id===attrs.id){
          const {title, project} = attrs;
          return {...timer, title, project};
        }
        return timer;
      })
    });
  }

  handleRemovePress=(timerId:string)=>{
    this.setState({
      timers:this.state.timers.filter(t=>t.id!==timerId)
    });
  }

  toggleTimer = (timerId:string) =>{
    this.setState((prevState):State=>{
      const {timers} = prevState;

      return {
        timers:timers.map(timer =>{
          const {id, isRunning} = timer;
          if(id===timerId){
            return {
              ...timer,
              isRunning:!isRunning,
            };
          }
          return timer;
        }),
      };
    })
  }

  componentDidMount(): void {
    const TIME_INTERVAL = 1000;
    this.intervalID = setInterval(()=>{
      const {timers} = this.state;

      this.setState({
        timers: timers.map(timer=>{
          const {elapsed,isRunning} = timer;
          return {
            ...timer,
            elapsed:isRunning?elapsed+TIME_INTERVAL:elapsed,
          };
        }),
      });
    },TIME_INTERVAL);
  }

  componentWillUnmount(): void {
    clearInterval(this.intervalID);
  }

  render(){
    const {timers} = this.state;

    return (
      <View style={styles.appContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Timers</Text>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.timerListContainer} >
          <ScrollView style={styles.timerList}>
            <ToggleableForm 
            onFormSubmit={this.handleCreateFormSubmit}
            onRemovePress={this.handleRemovePress}
            />
            {timers.map(({title,project,id,elapsed,isRunning})=>(
            <EditableTimer
              key={id}
              id={id}
              title={title}
              project={project}
              elapsed={elapsed}
              isRunning={isRunning}
              onFormSubmit={this.handleUpdateFormSubmit}
              onRemovePress={this.handleRemovePress}
              onStartPress={this.toggleTimer}
              onStopPress={this.toggleTimer}
            />
            )
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  appContainer:{
    flex:1,
  },
  titleContainer:{
    paddingTop:35,
    paddingBottom:15,
    borderBottomColor:"#D6D7DA",
    borderBottomWidth:1,
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerListContainer:{
    flex:1,
  },
  timerList:{
    paddingBottom: 15,
  },
})

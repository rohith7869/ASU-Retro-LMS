import React, { useState } from 'react';
import 'nes.css/css/nes.min.css';
import './TaskList.css';
import AddTask from './AddTask';
import TaskDescription from './TaskDesription';

interface Task {
  _id: string;
  title: string;
  deadline: string;
  details: string;
  point: number;
  course: string;
  graded: boolean;
}

interface TaskListProps {
  tasks: Task[];
  courseName: string;
  courseId: string;
  updateTasks: Function;
  role: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, courseName ,courseId, updateTasks, role}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createTask, setCreateTask] = useState<boolean>(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const showTaskList = () => {
    setCreateTask(false);
    updateTasks();
  };

  const onClickBack = () => {
    setSelectedTask(null);
    updateTasks();
  }

  const renderTaskDescription = () => {
    if (selectedTask) {
      return (

          <TaskDescription selectedTask={selectedTask} onClickBack={onClickBack} updateTasks={updateTasks} role={role} courseId={courseId}/> 
          
      );
    } else {
      return null;
    }
  };

  const renderTaskList = () => (
    <div className="">
      {role === 'instructor' ? (
          <div className='' style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100vh',
          }}>
            <img style={{width:'80px', height:'80px'}} src={require('../Leaderboard/avatar0.png')} alt="My Icon" />
            <div className="nes-container is-rounded" style={{
              fontSize:'1.5vh',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'left',
              maxHeight: '60px',
            }}>
              <strong style={{marginBottom:'-5px' }}>Sure, let's add to their misery.</strong>
              <div className="nes-field" style={{marginLeft:'85px' }}>
                    <button 
              className="nes-btn is-primary"
              onClick={() => setCreateTask(true)}>
                  Add Task
            </button>
                </div>
            </div>  
          </div>
        ) : (
          <div className='' style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100vh',
          }}>
            <img style={{width:'80px', height:'80px'}} src={require('../Leaderboard/avatar0.png')} alt="My Icon" />
            <div className="nes-container is-rounded" style={{
              fontSize:'1.5vh',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'left',
              maxHeight: '60px',
              marginLeft:'10px',
              marginTop:'10px'
            }}>
              <strong style={{marginBottom:'-5px' }}>{tasks.length > 0 ? "Finally you're here. I hope you have something to work on. Let's get those coins !!!" : 
              "Enjoy the calm before the storm; your task tsunami's on its way!"}</strong>
            </div>            
          </div>
        )}
    
              {tasks.map((task) => (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100vh',
                }}>
                <div className='nes-container with-title' style={{
                  marginTop: '10px',
                  width: '80vh',
                  textAlign: 'left',
                }} onClick={() => handleTaskClick(task)}>
                  <p className="title"><strong>{task.title}</strong></p>
                  <p className='two-line-p'>{task.details}</p>
                </div>
                <div className='nes-container' style={{
                  marginTop: '10px',
                  width: '15vh',
                  textAlign: 'center',
                }} onClick={() => handleTaskClick(task)}>
                  <p>{task.point}</p>
                </div>
                </div>
              ))}
        </div>
        );
    

  return (
    <div className="task-list-container">
      {!selectedTask ? (<div className="nes-container with-title is-centered ">
        <p className="title">{courseName} {createTask ? "Create Task": "Task List"}</p>
        {createTask ? (
          
          <AddTask createTask = {createTask} showTaskList = {showTaskList} courseId = {courseId} update={updateTasks}/> ) : 
          (renderTaskList()
          )
      }
      </div>
      ) :
      (
        <div className="task-description">
        {/* Render the task description component conditionally */}
        {renderTaskDescription()}
      </div>
      )
    }
    </div>
  );
};

export default TaskList;

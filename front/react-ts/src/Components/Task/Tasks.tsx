import React, { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";
import TaskList from "./TaskList";


interface Task {
  _id: string;
  title: string;
  deadline: string;
  details: string;
  point: number;
  course: string;
  graded: boolean;
}
interface TaskProps {
  courseId: string;
  role: string;
}

const Tasks: React.FC<TaskProps> = ({courseId, role}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updateTask, setUpdateTask] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [courseName, setCourseName] = useState<string>('');
  // const [role, setRole] = useState<string>('');

  const handleUpdateTask = () => {
    setUpdateTask(true);
  }

  useEffect(() => {
    // Function to fetch tasks from the server
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/task/getTasksByCourseId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            courseId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        setTasks(await response.json()); //await response.json();
      } catch (error) {
        console.error('Error fetching items:', error);
        // You can handle the error appropriately (e.g., show an error message)
      }
    };

    // Call the fetchTasks function when the component mounts
    if (updateTask) {
      fetchTasks();
      setUpdateTask(false);
    }
  }, [updateTask, courseId]); // The empty dependency array ensures that this effect runs only once when the component mounts
  return (
      
          <TaskList tasks={tasks} courseName={courseName} courseId = {courseId} updateTasks = {handleUpdateTask} role = {role}/> 
    
  );
};

export default Tasks;

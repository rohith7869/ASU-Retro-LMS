import React, { useEffect } from 'react';
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NotificationProps {
    courseId: string;
    role: string;
    IDs: {
      studentId: string;
      instructorId: string;
    }
}

const PushNotification:React.FC<NotificationProps> = ({courseId, role, IDs}) => {

  useEffect(() => {
    const socket = io("http://localhost:8080", { transports: ["websocket"] });
    const instructorPush = () => {
        socket.on("connection", () => {
      });

      socket.on(courseId, (data:any) => {
        toast.info(data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    };
    const studentPush = () => {
        socket.on("connection", () => {
      });

      socket.on(IDs.studentId, (data:any) => {
        toast.info(data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    };
    if (role === "instructor") {
      instructorPush();
    } else {
      studentPush();
    }

    return () => {
      socket.disconnect();
    };
  }, [courseId, role, IDs.studentId]);


  return (
    <div className="App">
      <ToastContainer />
    </div>
  );
}

export default PushNotification;

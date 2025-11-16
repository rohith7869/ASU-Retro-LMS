import { X } from 'lucide-react'
import React from 'react'
import {useState, useRef } from 'react'
import './CoursesSidebar.css'
import { Course } from '.'

interface CoursesSidebarProps {
    onClose: () => void; 
    onCourseClick: (description: string) => void;
    setComponent: () => void;
    courses: Course[];
    role: string;
  }
  
const CoursesSidebar: React.FC<CoursesSidebarProps> = ({ onClose, courses,  onCourseClick, setComponent, role}) => {
  const handleCourseClick = (description: string) => {
    // Pass the clicked course description to the parent function
    onCourseClick(description);
};

const handleAddCourse = () => {
  setComponent()
}
  const [showAllCourses, setShowAllCourses] = useState(true);
  const corusesRef = useRef<HTMLDivElement>(null);

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (corusesRef.current && !corusesRef.current.contains(event.target as Node)) {
  //     debugger;
  //       onClose();
  //   }
  // };

  // useEffect(() => {
  //   // Add event listener to close sidebar when clicking outside
        

  //       document.addEventListener('mousedown', handleClickOutside);
  //       return () => {
  //           document.removeEventListener('mousedown', handleClickOutside);
  //       };
  //   }, [onClose]
  // );

  return (
    <div ref={corusesRef}>
      <div className='header-container'>
        <h1 className='heading'>Courses</h1>
        <div className='close-button'>
          <X onClick={onClose} />
        </div>
      </div>
      {role === 'instructor' ? (<><hr />
      <div className='second-heading nes-pointer' onClick={() => {
        onClose(); // Close the sidebar
        handleAddCourse(); // Handle the Add Course click
      }}>Add Course</div>
      <hr /></>) : null}
      

      <hr />
      <h2 className='second-heading nes-pointer' onClick={() => {
        setShowAllCourses(!showAllCourses); // Toggle the state
      }}>
        {showAllCourses ? "Hide All courses" : "Show All courses"}
      </h2>
      <hr />
      {showAllCourses && (
        <div>
          {courses.map(course => (
            <h3 className='third-heading' key={course._id} onClick={() => {
              onClose(); // Close the sidebar
              handleCourseClick(course._id); // Handle the course click
            }}>{course.title}</h3>
          ))}
        </div>
      )}
    </div>
  );
  };
  
  export default CoursesSidebar;
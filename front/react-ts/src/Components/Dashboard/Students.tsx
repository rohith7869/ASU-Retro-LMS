import React, { useState, useEffect} from 'react';
import StudentData from './Student';
import axios from 'axios';
interface StudentProps {
    courseId: string;
}

export interface Student {
    studentId: string;
    userId: string;
    userName: string;
    fullName: string;
    password: string;
}

const Students:React.FC<StudentProps> = ({courseId}) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [studentCount, setStudentCount] = useState<number>(1);
    const [updateStudents, setUpdateStudents] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loaderMessege, setLoaderMessege] = useState<string>('Wait Wait, I am working on something');
    const [stringOfExclamation, setStringOfExclamation] = useState<string>('!');

    useEffect(() => {
        const t1 = setTimeout(() => {
            setLoaderMessege('Still working on it, Please wait')
        }
        , 3000);
        const t2 = setTimeout(() => {
            setLoaderMessege('I am too slow, I am afraid AI will take over my job')
        }, 6000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        }
    }, [loading]);

    useEffect(() => {
        const setStrings = () => {
            if (stringOfExclamation.length > 2) {
                setStringOfExclamation('!');
            } else {
                setStringOfExclamation(stringOfExclamation + '!');
            }
        }

        const t1 = setInterval(() => {
            setStrings()
        } , 500);
        return () => {
            clearInterval(t1);
        }
    }, [stringOfExclamation, loading]);


    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`http://localhost:8080/getEnrolledStudents/${courseId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }
                const students = await response.json();
                setStudents(students);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }
    , [updateStudents, courseId]);  

    const handleCsvFileDownload = async (url: string, filename: string) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/getEnrolledStudentsByCourseId/${courseId}`,
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode!.removeChild(link);
        window.URL.revokeObjectURL(url);    
      } catch (error) {
        console.error("Error generating students:", error);
      }
    };

    const handleGenerateStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/studentSignup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId: courseId,
                    count: studentCount,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to generate students");
            }
            setUpdateStudents(!updateStudents);
            setStudentCount(1);
        } catch (error) {
            console.error("Error generating students:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentClick = (student: Student) => {
        setSelectedStudent(student);
    }

    const handleBack = () => {
        setSelectedStudent(null);
        setUpdateStudents(!updateStudents);
    }

    const renderStudents = () => (
        <div className="student-list" style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}>

                    {
                    
                    students.map((student, index) => (
                        <div key={index} onClick={()=>{handleStudentClick(student)}}
                        className="nes-container" style={{ marginRight: index%2 === 0 ? "1rem" : "0rem" , marginBottom: "1rem", width: "44vh"}}>
                            <p>{student.fullName}</p>
                        </div>
                    ))
                    }
                </div>
    );

    const renderGuideToAddStudents = () => (
        <div style={{
            marginTop: "2rem",
        }}>
          <section className="message-right">
            <div className="nes-balloon from-left" style={{marginRight:'20%'}}>
              <p>Ah, the duty of creating student accounts. So, how many souls shall I enslave today?</p>
              <div className="nes-field" style={{ display: "flex", alignItems: "center" }}>
                    <input 
                        type="number" 
                        id="studentCount" 
                        className="nes-input" 
                        placeholder="E.g., 10" 
                        value={studentCount} 
                        onChange={(e) => setStudentCount(Math.floor(Number(e.target.value)))}
                        style={{ flex: 1, marginRight: "1rem" }}
                    />
                    <button 
                        type="button" 
                        onClick={handleGenerateStudents} 
                        className="nes-btn is-primary"
                        style={{ width: "30%" }}
                    >
                        Generate Students
                    </button>
                    <button 
                        type="button" 
                        onClick={() => handleCsvFileDownload('/download-csv', 'data.csv')} 
                        className="nes-btn is-primary"
                        style={{ width: "30%", marginLeft:"1rem"}}
                    >
                        Download CSV
                    </button>
                </div>
            </div>
          </section>
          <img style={{width:'80px'}} src={require('../Leaderboard/avatar0.png')} alt="My Icon" />
      </div>
    );

    const renderLoader = () => (
        <div>
            <div className="nes-container with-title" style={{ 
            fontSize: "0.8rem",  minWidth: "100vh", height:'78vh',
             }}>
        <p className="title">Students</p>
        <section className="message-right">
            <div className="nes-balloon from-left" style={{marginRight:'20%', marginTop:'20vh', marginLeft:'20vh'}}>
              <p>{loaderMessege} {stringOfExclamation}</p>
              
            </div>
          </section>
          <img style={{width:'80px', marginLeft:'13vh'}} src={require('../Leaderboard/avatar0.png')} alt="My Icon" />
          </div>
           </div>
    );


   return (
    <>
        {
        
        loading ? renderLoader() : 
        selectedStudent ? (<StudentData student={selectedStudent} handleBack = {handleBack}/>) : (
            <div className="nes-container with-title" style={{ fontSize: "0.8rem" }}>
        <p className="title">Students</p>
            <div className='all-students-container' style={{minWidth:'100vh'}}>
                
                {
                    renderGuideToAddStudents()
                }
                {
                    renderStudents()
                }
                
            </div>
        </div>)}
        </>
    
)



};
export default Students;
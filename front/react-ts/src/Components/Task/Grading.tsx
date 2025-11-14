import React, { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";
import StudentPoints from "./StudentPoints";

interface GradingProps {
    taskId: string;
}

const Grading: React.FC<GradingProps> = ({ taskId }) => {

    const [submissionRecords, setSubmissionRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaderMessege, setLoaderMessege] = useState<string>('Wait Wait, I am working on something');
    const [stringOfExclamation, setStringOfExclamation] = useState<string>('!');

    useEffect(() => {
        // const t1 = setTimeout(() => {
        //     setLoaderMessege('Still working on it, Please wait')
        // }
        // , 3000);
        const t2 = setTimeout(() => {
            setLoaderMessege('I am almost there, Please wait')
        }, 6000);
        const t3 = setTimeout(() => {
            setLoaderMessege('I am too slow, I am afraid AI will take over my job')
        }, 3000);

        return () => {
            // clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
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
        const fetchSubmissionRecords = async () => {
            try {
                const response = await fetch(`http://localhost:8080/getSubmissionsByTask/${taskId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch submission records");
                }
                const data = await response.json();
                setSubmissionRecords(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSubmissionRecords();
    }, [taskId]);

    const renderLoader = () => (
        <div>
            <div className="" style={{ 
            fontSize: "0.8rem",  minWidth: "100vh", height:'78vh',
             }}>
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div>
            { loading ? renderLoader() :
                submissionRecords.map((sub: any) => {
                    return (<StudentPoints studentName={sub.studentName} points={sub.points} submissionId={sub._id} key={sub._id} />)
                })
            }
        </div>
    </div>
);


};

export default Grading;
import React, { useState, useEffect } from "react";
import Loader from "../Other/Loader";

interface LBProps {
  courseId: string;

}
interface StudentScore  {
    name: string;
    score: number;
  }

const getPNGbyRank = (rank: number) => {
  if (rank === 1) {
    return require('./rankImagesPNG/rank1.png');
  } else if (rank === 2) {
    return require('./rankImagesPNG/rank2.png');
  } else if (rank === 3) {
    return require('./rankImagesPNG/rank3.png');
    } else if (rank === 4) {
    return require('./rankImagesPNG/rank4.png');
    } else if (rank === 5) {
    return require('./rankImagesPNG/rank5.png');
  } else {
    return require('./rankImagesPNG/other.png');
  } 

}

const Leaderboard: React.FC<LBProps> = ({courseId}) => {
  const [data, setData] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to fetch students enrolled in the specified course
    const fetchStudents = async () => {
      try {

        const response = await fetch(`http://localhost:8080/leaderboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseId }),
          credentials: 'include',
        })
        if (!response.ok) {
          console.log('no data or error')
        } else {
          setData(await response.json());
        } 
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
          setLoading(false);
      }
    };
    fetchStudents();
  });

const renderLeaderboard = () => {
  return (
    <div className="nes-container with-title is-dark" style={{
      minHeight: '80vh',
    }}>
      <p className="title" style={{
        color: 'yellow',
      }}>Leaderboard</p>
      {data.map((student, index) => (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100vh',
        }}>
          <div key={index} className="nes-container is-rounded with-title is-dark" style={{
            width: '80%',
            textAlign: 'center'
          }}>
            <p className="title" style={{color:'red', marginLeft:'5px'}}>{index + 1}</p>
            <img src={getPNGbyRank(index + 1)} alt="Rank" style={{
              width: '40px',
              margin: '-15px 0px -5px 0px',
            }}/>
              <p style={{color:'yellow', margin:'-30px 0px 18px 0px'}}>{student.name}</p>
          </div>
          <div className="nes-container is-rounded with-title is-dark" style={{
            textAlign: 'center',
          }}>
            <p className="title" style={{
              color: 'red',
            }}>Score</p>
            <p style={{color:'yellow', margin:'0px 0px 8px 0px'}}>{student.score}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

  const renderNoData = () => {
    return (
        <div className="nes-container is-rounded with-title is-dark" style={{
          minWidth:'108vh',
          minHeight:'78vh',
          
          }}>
          <p className="title" style={{color:"yellow"}}>Leaderboard</p>
          <section className="message-right">
            <div className="nes-balloon from-left is-dark" style={{ marginRight:'20%'}}>
              <p>Hey there! Admin on duty. Let's bring in some new faces.</p>
            </div>
          </section>
          <img className="imgInvert" style={{
            filter: 'invert(0.9)',
            width:'80px',
            }} src={require('./avatar0.png')} alt="My Icon" />
          <section className="message -right">
            <div style={{marginLeft:'40%'}} className="nes-balloon from-right is-dark">
              <p>Absolutely! Time to whip up a batch of fresh students.</p>
            </div>
            <img style={{width: '100px', marginLeft:'88%'}} src={require('../Shop/avatar.png')} alt="My Icon" />
          </section>
        </div>
    );
  }

  const renderLoading = () => (
    <div className="is-dark nes-container with-title is-rounded">
      <p className="title" style={{color:'yellow'}}>Leaderboard</p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        width: '100vh',
      }}>
        <Loader style={{color:'yellow', marginTop:'-1vh'}}/>
      </div> 
    </div>

  );

  return (
    <>
      {
        loading ? renderLoading() : data.length ? renderLeaderboard() : renderNoData()
      }
    </>
  );
};

export default Leaderboard;

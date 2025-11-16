import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "nes.css/css/nes.min.css";
import ItemList from "./ItemList";
import Loader from "../Other/Loader";

export interface Item {
    _id: string;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    courseId: string;
    itemExpiry: number;
}

interface ItemProps {
  role: string;
  courseId: string;
  studentBalance: number;
  fullName: string;
}

const Items: React.FC<ItemProps> = ({ role, courseId, studentBalance, fullName }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    // const [courseName, setCourseName] = useState<string>('SER517');
    // const [role, setRole] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const [updateItems, setUpdateItems] = useState<boolean>(false);


    const updateItemList = () => {
      setUpdateItems(!updateItems);
    }

    useEffect(() => {
      // Function to fetch items from the server
      const fetchItems = async () => {
        try {
          // const courseId = '65ee276576ac94ef4a77bdba'; // Replace with the actual courseName
          const response = await fetch(`http://localhost:8080/items/course/${courseId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch items');
          }

          const items: Item[] = await response.json();
          setItems(items)
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchItems();
    }, [updateItems, courseId]);

    const renderLoader = () => 
       (
      <div className="nes-container is-rounded" style={{
        width: '100vh',
        height: '82vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
          <Loader style={{
            color: 'black',
            marginTop: '-2rem',
          }} />
      </div>
      )  
    return (
      <>
      { 
      loading ? renderLoader() :
      <ItemList items={items} courseId={courseId} role={role} update = {updateItemList} fullName={fullName} />
      }
      </>
    );
  };


export default Items
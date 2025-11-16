import React, { useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import "./ItemList.css";
import { Item } from './Items';
import AddItem from './AddItem';
import ItemDescription from './ItemDescription';
import ItemCard from './ItemCard';
import './ItemCard.css';
import RequestList from './RequestList';
import io from "socket.io-client";

const coin = require('./spinningCoin.gif')

interface ItemListProps {
    items: Item[];
    courseId: string;
    role: string;
    update: Function;
    fullName: string;
}



const ItemList: React.FC<ItemListProps> = ({ items, fullName, courseId, role, update }) => {
    const [createItem, setCreateItem] = React.useState<boolean>(false);
    const [showItem, setShowItem] = React.useState<boolean>(false);
    const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
    const [showItemRequests, setShowItemRequests] = React.useState<boolean>(false);
    const [studentBalance, setStudentBalance] = React.useState<number>(0);
    const [updateCurrency, setUpdateCurrency] = React.useState<boolean>(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await fetch("http://localhost:8080/profile", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    const profile = await response.json();
                    setStudentBalance(profile.currency);
                }
            } catch (error) {
                console.error("Error fetching profile.", error);
            }
        }
        getProfile();
    }
    ,[updateCurrency]);
    

    const handleItemDescription = (item: Item) => {
      setShowItem(true);
      setSelectedItem(item);
    };

    const handleItemRequest = (item: Item) => {
      setShowItemRequests(true);
      setSelectedItem(item);
    }

    const handleAddItem = () => {
      setCreateItem(true);
    }

    const handleBack = () => {
      setCreateItem(false);
      setShowItem(false);
      setShowItemRequests(false);
    }

    const renderItemDescription = () => (
      <ItemDescription selectedItem={selectedItem} update={update} role={role} handleBack={handleBack}/>
    );

    const sendNotification = (selectedItem:Item) => {
        const socket = io("http://localhost:8080", { transports: ["websocket"] });
        socket.emit("buyItem", { message: `${fullName} requested ${selectedItem?.itemName}`, courseId: courseId});
    };

    const handleBuyRequest = async (selectedItem:Item) => {
    try {
      const response = await fetch("http://localhost:8080/requestItem", {
        method: "POST",
        headers: {
                    'Content-Type': 'application/json'
                },
        credentials: 'include',
        body: JSON.stringify({
          itemId: selectedItem?._id,
          price: selectedItem?.itemPrice
        })
      });
      if (response.ok) {
        setUpdateCurrency(!updateCurrency);
        sendNotification(selectedItem);
      }
    } catch (error) {
      console.error("Error buying item.", error);
    } 
  };

  const renderNoShopComponent = () => (
    <div>
      <div className="">
        <div className="nes-container is-rounded with-title" style={{width:'100vh'}}>
          <p className="title">Shop</p>
          <section className="message-right">
            <div className="nes-balloon from-left is-dark" style={{ marginRight:'', fontSize:'0.8rem'}}>
              <p>{role === 'instructor' ? "More items for the shop, Professor? Let's dangle some shiny incentives in front of our students, shall we?":"Please come back later to skip the assignment or class."}</p>
            </div>
          </section>
          {/* <i style={{}} className="nes-octocat animate"></i> */}
          <img style={{width:'80px'}} src={require('../Leaderboard/avatar0.png')} alt="My Icon" />
          <section className="message -right">
            <div style={{marginLeft:'20%', fontSize:'0.8rem'}}className="nes-balloon from-right is-dark">
              <p>{role === 'instructor' ? "Yes, because what's education without a little bribery?":"Waiting for that 'SKIP FINALS' perk."}</p>
            </div>
            <img style={{width: '100px', marginLeft:'88%'}} src={require('./avatar.png')} alt="My Icon" />
          </section>
        </div>
      </div>
      {role === 'instructor' && (
        
        <div className="flex items-start ml-6" style={{ marginTop: "10px" }}>
          <button type='button' className='nes-btn is-primary' onClick={handleAddItem}>Add Item</button>
        </div>
      )}
    </div>
  );


  const renderShopComponent = () => (
  <div className='nes-container is-rounded with-title'>
      <p className='title'>Shop</p>
      {role === 'student' && <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vh',
      }}>
        <p className=''>Balance: </p>
        <img style={{
                    width:'22px',
                    height:'22px',
                    marginTop:'-1px',
                }} src={coin} alt='coin-spinning'/>
        <strong style={{marginLeft:'5px'}}>{studentBalance}</strong>

      </div>}
      <div className="item-list-content">
        {
        items.map((item, index) => (
          <ItemCard key={`item-${index}`} item={item} role={role} studentBalance={studentBalance}
            handleItemDescription={handleItemDescription} handleItemRequest={handleItemRequest}
            handleItemBuy={handleBuyRequest} />
        ))
        }
      </div>
      {role === 'instructor' && (
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
              maxHeight: '70px',
              marginLeft:'10px',
              marginTop:'10px'
            }}>
              <strong style={{marginRight:'' }}>Dont be tough on your students, give them some sweet perks. !!!</strong>
            
                  <button type='button' style={{
                    width: '30%',
                  }} className='nes-btn is-primary' onClick={handleAddItem}>Add Item</button>
         
            </div>     
            </div>

      )}
    {role === 'student' && <div className='' style={{
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
              <strong style={{marginBottom:'-5px' }}>Better stockpile some coins for those sweet perks. Credit cards won't buy you everything !!!</strong>
            </div>     
            </div>  }     
      </div>
    );


    const renderAddItemComponent = () => (
      <AddItem courseId={courseId} update={update} handleBack={handleBack}/>
    );

    const renderRequestComponent = () => ( 
      <RequestList item={selectedItem} handleBack={handleBack}/>
    );
    


    return (
        <div className="item-list-container">
       
          {
          showItem ? 
            renderItemDescription() : 
            <div>
                  {
                    createItem ? renderAddItemComponent() : showItemRequests ? renderRequestComponent() : items.length ? renderShopComponent() : renderNoShopComponent()
                  }
            </div>
          }
          
        </div>
      );
    };
export default ItemList;
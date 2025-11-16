import React, {useEffect, useState} from 'react';
import Loader from '../Other/Loader';
import { Item } from './Items';
import coin from './spinningCoin.gif'


interface ItemProps {
  item: Item;
  role: string;
  studentBalance: number;
  handleItemDescription: Function;
  handleItemRequest: Function;
  handleItemBuy: Function;
}

interface Transaction {
    _id: string;
    itemId: string;
    studentId: string;
    price: number;
    status: string;
}


const ItemCard: React.FC<ItemProps> = ({ item, role, handleItemDescription, handleItemRequest, handleItemBuy, studentBalance }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [transaction, setTransaction] = useState<Transaction|null>(null);
    const [transactionState, setTransactionState] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    


    const getTransction = async () => {
                try {
                const response = await fetch(`http://localhost:8080/getTrasactionsByItemByStudent/${item?._id}`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    
                } else {
                    const transaction: Transaction = await response.json();
                    setTransaction(transaction);
                    setTransactionState(transaction.status);
                }
                } catch (error) {
                console.error('Error fetching tasks:', error);
                } finally {
                    setLoading(false);
                }
            };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        
        if (role === 'student') {
            getTransction();
        } else {
            setLoading(false);
        }
        
    });

    

    const renderShopComponent = () => (
        <div 
            className="nes-container is-centered is-rounded is-dark item-card"
            style={{}}
            onClick={() => handleItemDescription(item)}>
            { loading ? <Loader style={{color:'white'}}/> :
            <>
            <div className="item-content">
                <span style={{
                    color:'cyan'
                }}>{item.itemName}</span>
                <p style={{color:'cyan'}}>{item.itemDescription}</p>
                <div style={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                <img style={{
                    width:'22px',
                    height:'22px'
                }} src={coin} alt='coin-spinning'/>
                <span style={{
                    marginTop:'4px',
                    marginLeft:'3px',
                    color:'gold'
                }}>{item.itemPrice}</span>
                </div>
            </div>
            {
                role === "instructor" ? (
                    <button className="nes-btn buy-button" style={{
                        backgroundColor:'#2bba29'
                    }} onClick={(e)=>{
                        e.stopPropagation();
                        handleItemRequest(item);
                    }}>Requests</button>
                ) : 
                transactionState ? 
                <button className="nes-btn is-disabled buy-button">{transactionState}</button>:
                <button style={{
                    backgroundColor:'gold'
                
                }} className={`nes-btn buy-button` + (studentBalance < item.itemPrice ? ' is-disabled' : '')}
                onClick={(e)=>{
                    e.stopPropagation();
                    if (studentBalance < item.itemPrice) {
                        return;
                    }
                    setTransactionState('Awaiting');
                    handleItemBuy(item);
                }}>Buy</button>
            }
        </>}
        </div>
    );

    return (
        <>{renderShopComponent()}</>
    );
};
export default ItemCard;

import React, { useState } from 'react';
import 'nes.css/css/nes.min.css';

interface AddItemProps {
  courseId: string;
  update: Function;
  handleBack: Function;
}

const AddItem: React.FC<AddItemProps> = ({courseId, update, handleBack}) => {

  const [itemName, setItemName] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [itemExpiry, setItemExpiry] = useState<number>(0);
  const [errorMeessege, setErrorMeessege] = useState<string>('');

  const handleAddItem = async () => {
    if (!itemName || !itemDescription ) {
      setErrorMeessege('Name and Description fields are required.');
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/createItem", {
        method: "POST",
        headers: {
                    'Content-Type': 'application/json'
                },
        credentials: 'include',
        body: JSON.stringify({
          itemName,
          itemDescription,
          itemPrice,
          itemExpiry,
          courseId,
        })
      });

      if (response.ok) {
        update();
        handleBack();
      }

    } catch (error) {
      console.error("Error creating item.", error);
    }
  }

  return (
    <div className="item-description-container">
      <div className="nes-container with-title is-dark is-centered is-rounded" style={{
        width: '100vh',
        marginTop:'vh'
      }}>
        <p className="title">Add Item</p>
        <div className='field-container-two'>
              <div className="nes-field" >
                <label htmlFor='name'>Name</label>
                <input
                style={{backgroundColor:'#212529'}}
                  type='text'
                  id='name'
                  className="nes-input is-dark"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div className="nes-field">
                <label htmlFor='price'>Price</label>
                <input
                style={{backgroundColor:'#212529'}}
                  type='number'
                  id='price'
                  className="nes-input is-dark"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                />
              </div>
        </div>
        <div className="nes-field" style={{marginTop:'2vh'}}>
                <label htmlFor='description'>Description</label>
                <textarea
                  style={{backgroundColor:'#212529'}}
                  id='description'
                  className="nes-input is-dark"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                />
              </div>
          <div className='error-message'>
            {errorMeessege && <p className="nes-text is-error">{errorMeessege}</p>}

          </div>
        <div className='flex items-start my-10'>
          <button type="button" className='nes-btn is-success' onClick={()=>{
            handleBack();
          }}>Back</button>
          <button type="button" className='nes-btn is-primary' style={{marginLeft:'5vh'}} onClick={handleAddItem}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddItem;

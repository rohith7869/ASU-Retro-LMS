import React, {useEffect, useState} from 'react';
import Loader from '../Other/Loader';

interface NotificationProps {
    role: string;
    courseId: string;
}

interface Notification {
    _id: string;
    message: string;
    userId: string;
    read: boolean;
}

const avatar = require('../Leaderboard/avatar0.png');


const NotificationList:React.FC<NotificationProps> = ({role, courseId}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateNotifications, setUpdateNotifications] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateNotificationList = () => {
        setUpdateNotifications(!updateNotifications);
    }

    const fetchNotifications = async () => {
            try {
                const response = await fetch(`http://localhost:8080/notifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        courseId,
                        role
                    })
                });

                if (!response.ok) {

                }
                const notifications: Notification[] = await response.json();
                setNotifications(notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

    const updateStatus = async () => {
        try {
            const response = await fetch(`http://localhost:8080/updateNotifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notifications: notifications.filter(notification => !notification.read)
                })
            });

            if (!response.ok) {
                console.log('Notifications NOT updated')

            } else {
                console.log('Notifications updated')
            }
        } catch (error) {
            console.error('Error updating notifications:', error);
        }
    }

    useEffect(() => {
        fetchNotifications();
        updateStatus();
    });

    const renderLoader = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            width: '100vh'
        }}>
            <Loader style={{color:'black'}}/>
        </div>
    );

    const renderNoNotifications = () => (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
                <img src={avatar} alt='leaderboard' style={{width:'100px', height:'100px', marginLeft:'-20px'}}/>
                <div className="nes-balloon from-left" style={{width:'50vh'}}>
                    <p>You don't have any notifications...</p>
                </div>
            </div>
    );

    const renderNotifications = () => (
        <>
            <div className=''>
                {notifications.map((notification, index) => (
                        <div key={index} className="nes-container" style={{
                            // borderColor: notification.read ? 'black' : 'red',
                            marginBottom: '10px',
                        }}>
                            <p>{notification.message}</p>
                        </div>
                ))}
            </div>
        </>
    )

    const renderList = () => (
        <div className='nes-container with-title is-rounded' style={{
            minWidth: '100vh',
            minHeight: '82vh',
        }}>
            <p className='title'>Notifications</p>
            { notifications.length > 0 ? renderNotifications() : renderNoNotifications()}
        </div>
    );

    return (
        <div>
            {loading ? renderLoader() : renderList()}
        </div>
    );
}

export default NotificationList;
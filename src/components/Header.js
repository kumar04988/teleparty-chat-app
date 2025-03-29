import React from 'react'
import back_arrow from '../assets/images/arrow_left.svg'
import './Header.scss'

const Header = ({ title, resetRoomId, onClick }) => {

    return (
        <div className='chat-header'>
            <div className='back-arrow-roomId'>
                <img src={back_arrow} alt="back" onClick={resetRoomId} />
                <div className='title-msg'>RoomId: {title}</div>
            </div>
            <button onClick={onClick}>End session</button>
        </div>
    )
}

export default Header
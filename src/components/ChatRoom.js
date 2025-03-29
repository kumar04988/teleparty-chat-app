import { useEffect, useRef } from "react";
import Header from "./Header";
import ImagePopup from "./ImagePopup/ImagePopup";
import { useSelector } from "react-redux";
import { SocketMessageTypes } from "teleparty-websocket-lib";
import './ChatRoom.scss'

const ChatRoom = ({ nickname, usersTyping, roomId, message, client, setMessage, setRoomIdStatus, initialiseSession, usersList, setUsersTyping, userId }) => {

  const { messages } = useSelector(state => state.chat)
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const resetRoomId = () => {
    setRoomIdStatus(false)
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!client) {
      window.location.reload();
      return
    }
    if (message.trim() === "") return;

    const messageData = {
      body: message,
      // sender: nickname,
    };

    client.sendMessage(SocketMessageTypes.SEND_MESSAGE, messageData);
    setMessage("");
  };


  const handleTyping = async (isTyping) => {
    if (!client) return
    const messageData = {
      typing: isTyping
    }
    await client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, messageData)
  }


  const handleInputChange = (e) => {
    setMessage(e.target.value);
    handleTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
      setUsersTyping([])
    }, 300);
  };

  const endSession = () => {
    client.teardown()
    window.location.reload()
  }

  return (
    <div>
      <Header resetRoomId={resetRoomId} title={roomId} onClick={endSession} />
      <div className="chatBox">
        <div className="messageList">
          {messages?.map((msg, index) => {
            const timeString = new Date(msg.timestamp).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

            return (
              <div className="msg-wrapper">
                {(msg?.isSystemMessage)
                  ?
                  <div className="chat-info-msg" key={index}>
                    <span>{msg.sender} {msg.text}</span></div>
                  :
                  <div className={msg.sender === nickname ? "msg-profile-image" : "msg-profile-image"}>
                    {msg?.userIcon && msg.sender !== nickname && <ImagePopup header={msg.sender} image={msg?.userIcon} />}

                    <div
                      key={index}
                      className={msg.sender === nickname ? "message self" : "message other"}
                    >
                      <div className="sender-text">
                        {msg.sender !== nickname && <div className="sender">{msg.sender}</div>}
                        <div className="sender-msg">{msg.text}</div>
                      </div>
                      <div className="timestamp">{timeString}</div>
                    </div>
                  </div>
                }
              </div>
            );
          })}

          {usersTyping.length > 0 && (
            usersTyping.map((userNo, index) => {
              return (
                <>
                  {userNo !== userId &&
                    <div className="typing-msg" key={index}>
                      <div className="opp-type-name">{usersList[userNo]}</div>
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>

                  }
                </>
              )
            })
          )}

          <div ref={messageEndRef} />
        </div>
        <div className="messageInput">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;

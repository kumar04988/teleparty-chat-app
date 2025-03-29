import React, { useState, useEffect } from "react";
import { TelepartyClient } from "teleparty-websocket-lib";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import ChatLogin from "./ChatLogin";
import ChatRoom from "./ChatRoom";
import DotLoader from "./Loaders/DotLoader/DotLoader";
import { APPEND_NEW_MESSAGE, RESET_ALL_MESSAGES } from "../redux/actionTypes";
import chat_bg from '../assets/images/chat_bg.png'
import "./Chat.scss";

const Chat = () => {
    const [roomId, setRoomId] = useState("");
    const [roomIdStatus, setRoomIdStatus] = useState(false)
    const [bgImg, setBgImg] = useState("")
    const [userId, setUserId] = useState("")
    const [usersTyping, setUsersTyping] = useState([])
    const [usersList, setUsersList] = useState([])
    const [image, setImage] = useState(null);
    const [client, setClient] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm()
    const { watch } = form
    const dispatch = useDispatch()
    let nickname = watch("nickname")

    const errorMsg = (msg) => {
        toast.error(msg, { position: "bottom-center" });
    };

    const successMsg = (msg) => {
        toast.success(msg, { position: "bottom-center" });
    };

    const initialiseSession = () => {
        const eventHandler = {
            onConnectionReady: () => successMsg("Connected to WebSocket"),
            onClose: () => {
                errorMsg("WebSocket connection closed")
                dispatch({ type: RESET_ALL_MESSAGES })
                setRoomIdStatus(false)
                setRoomId("")
                if (client) {
                    client.teardown()
                } else {
                    initialiseSession()
                }
            },
            onMessage: (msg) => {
                if (msg?.type === "userList") {
                    const users = msg.data.reduce((acc, user) => {
                        acc[user.socketConnectionId] = user.userSettings.userNickname;
                        return acc;
                    }, {});
                    setUsersList(users)
                }

                if (msg?.type === "userId" && msg?.data?.userId) {
                    setUserId(msg.data.userId);
                }

                if (msg?.type === "setTypingPresence" && msg?.data?.usersTyping) {
                    setUsersTyping(msg.data.usersTyping);
                }

                if (msg?.type === 'sendMessage' && msg?.data?.body) {
                    const { body, userNickname, timestamp, userIcon, isSystemMessage } = msg.data;
                    dispatch({
                        type: APPEND_NEW_MESSAGE,
                        payload: {
                            text: body,
                            sender: userNickname,
                            timestamp: timestamp,
                            userIcon: userIcon,
                            isSystemMessage: isSystemMessage
                        }
                    })
                }
            },
        };

        const newClient = new TelepartyClient(eventHandler);
        setClient(newClient);
    };


    useEffect(() => {
        initialiseSession()
        return () => {
            if (client) client.teardown();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            style={{ backgroundImage: bgImg ? `url(${bgImg})` : `url(${chat_bg})`, overflowY: "hidden" }}
            className="chat-wrapper"
        >
            {!roomIdStatus ?
                <ChatLogin
                    form={form}
                    roomId={roomId}
                    setRoomId={setRoomId}
                    setRoomIdStatus={setRoomIdStatus}
                    nickname={nickname}
                    client={client}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                    initialiseSession={initialiseSession}
                    image={image}
                    setBgImg={setBgImg}
                    setImage={setImage}
                    setIsLoading={setIsLoading}
                />
                :
                (roomIdStatus &&
                    <ChatRoom
                        nickname={nickname}
                        usersTyping={usersTyping}
                        roomId={roomId}
                        message={message}
                        client={client}
                        setMessage={setMessage}
                        setRoomIdStatus={setRoomIdStatus}
                        initialiseSession={initialiseSession}
                        usersList={usersList}
                        setUsersTyping={setUsersTyping}
                        userId={userId}
                    />
                )
            }
            {isLoading &&
                <div className="full-height-spinner ">
                    <DotLoader />
                </div>
            }
        </div>
    );
};

export default Chat;

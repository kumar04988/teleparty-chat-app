import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { FaPlus } from "react-icons/fa";
import axios from 'axios'
import { ADD_ALL_MESSAGES } from "../redux/actionTypes";
import './ChatLogin.scss'

const ChatLogin = ({ form, roomId, setRoomId, setRoomIdStatus, nickname, client, errorMsg, successMsg, initialiseSession, image, setBgImg, setImage, setIsLoading }) => {

    const { formState: { errors }, register, watch } = form
    const inputRef = useRef(null);
    const dispatch = useDispatch()
    const [tab, setTab] = useState("create");

    const GITHUB_USERNAME = "kumar04988";
    const REPO_NAME = "Images";
    const BRANCH = "main";
    const FOLDER = "images";
    const GITHUB_TOKEN = "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";

    let roomIdInfo = watch("roomId")

    const createRoom = async () => {
        const isValid = await form.trigger();
        if (!isValid) return;
        try {
            if (!client) initialiseSession();
            const newRoomId = await client.createChatRoom(nickname, image);
            setRoomId(newRoomId);
            setRoomIdStatus(true);
        } catch (error) {
            errorMsg(`Error creating room: ${error}`);
        }
    };

    const uploadBgImg = (e) => {
        const url = URL.createObjectURL(e.target.files[0])
        setBgImg(url)
    }

    const joinRoom = async () => {
        const isValid = await form.trigger()
        if (!isValid) return
        if (!client) return;
        try {
            const messageList = await client.joinChatRoom(nickname, roomIdInfo, image);
            setRoomId(roomIdInfo)
            dispatch({
                type: ADD_ALL_MESSAGES,
                payload: messageList.messages.map((msg) => ({
                    text: msg.body,
                    sender: msg.userNickname,
                    timestamp: msg.timestamp,
                    userIcon: msg?.userIcon,
                    isSystemMessage: msg?.isSystemMessage,
                }))
            })
            setRoomIdStatus(true)
        } catch (error) {
            errorMsg(`Error joining room: ${error}`)
        }
    };

    const redirectToExistingSession = () => {
        if (roomId === "") {
            errorMsg("No active session")
            return
        } else {
            setRoomIdStatus(true)
        }
    }

    const onImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            errorMsg("Please select an image first");
            return;
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            errorMsg("Only PNG, JPG & JPEG images are allowed.");
            return;
        }

        try {
            setIsLoading(true);
            const imageExtension = file.type.split("/")[1];
            const imageName = `${uuidv4()}.${imageExtension}`;
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                try {
                    const base64Image = reader.result.split(",")[1];
                    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FOLDER}/${imageName}`;

                    await axios.put(
                        url,
                        {
                            message: `Upload ${imageName}`,
                            content: base64Image,
                            branch: BRANCH,
                        },
                        {
                            headers: {
                                Authorization: `token ${GITHUB_TOKEN}`,
                                Accept: "application/vnd.github.v3+json",
                            },
                        }
                    );

                    const uploadedImageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/${FOLDER}/${imageName}`;
                    setImage(uploadedImageUrl);
                    successMsg("Profile image added");
                } catch (error) {
                    errorMsg("Error uploading image");
                } finally {
                    setIsLoading(false);
                }
            };
        } catch (error) {
            setIsLoading(false);
            errorMsg("Unexpected error occurred.");
        }
    };


    return (
        <div className="chatContainer">
            <div className="chatTab">
                {tab === "create" ? <h2>Create Room</h2> : <h2>Join Room</h2>}

                <div className="image-uploader">
                    <div className="upload-box" onClick={() => inputRef.current.click()}>
                        {image ? (
                            <img src={image} alt="Uploaded" className="uploaded-img" />
                        ) : (
                            <>
                                <div className="upload-icon">
                                    <FaPlus className="plus-icon" />
                                </div>
                            </>

                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        ref={inputRef}
                        style={{ display: "none" }}
                    />
                </div>

                {tab === "create" ? (
                    <>
                        <input
                            type="text"
                            placeholder="Enter your nickname"
                            {...register("nickname", {
                                validate: (value) => value ? true : "*Nickname is required"
                            })}
                            autoComplete="off"
                        />
                        <div className="err-msg">{errors?.nickname?.message}</div>
                        <button onClick={createRoom}>Create Room</button>
                        <button onClick={() => setTab("join")} className="switchTab">Go to Join</button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            value={nickname}
                            {...register("nickname", {
                                validate: (value) => value ? true : "*Nickname is required"
                            })}
                            placeholder="Enter your nickname"
                            autoComplete="off"
                        />
                        <div className="err-msg">{errors?.nickname?.message}</div>

                        <input
                            {...register("roomId", {
                                validate: (value) => value ? true : "*RoomId is required"
                            })}
                            type="text"
                            placeholder="Enter Room ID"
                            autoComplete="off"
                        />
                        <div className="err-msg">{errors?.roomId?.message}</div>
                        <button onClick={joinRoom}>Join Room</button>
                        <button onClick={() => setTab("create")} className="switchTab">Go to Create</button>
                    </>
                )}
            </div>

            <label htmlFor="bg-img" >Upload Background
                <input accept="image/*" id="bg-img" type="file" onChange={uploadBgImg} style={{ display: "none" }} />
            </label>
            <button onClick={redirectToExistingSession}>Existing Session</button>
        </div>
    );
};

export default ChatLogin;

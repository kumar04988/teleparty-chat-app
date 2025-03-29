import { ADD_ALL_MESSAGES, APPEND_NEW_MESSAGE, RESET_ALL_MESSAGES } from "../../actionTypes";

const initialState = {
    messages: []
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALL_MESSAGES:
            return { messages: action.payload }

        case APPEND_NEW_MESSAGE:
            return { messages: [...state.messages, action.payload] }

        case RESET_ALL_MESSAGES:
            return initialState

        default:
            return state
    }
}

export default chatReducer;

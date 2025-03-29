import { combineReducers } from 'redux';
import chatReducer from './chat/chatReducer';

const appReducer = combineReducers({
    chat: chatReducer,
});

export default appReducer;

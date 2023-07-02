import User from "./user";
import AdvID from "./advertise";
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    AdvID,
    User
});

export default rootReducer;
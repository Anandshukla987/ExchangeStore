const initialState = '';
const AdvID = (state = initialState, action) => {
    switch (action.type) {
        case 'setAdvID': return action.payload;
        case 'remAdvID': return action.payload;
        default: return state;
    }
}

export default AdvID;
const initialState = {};
const User = (state = initialState, action) => {
    switch (action.type) {
        case 'setUser': return action.payload;
        case 'remUser': return action.payload;
        default: return state;
    }
}

export default User;
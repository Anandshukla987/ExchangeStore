export const initialState = null;

export const reducer = (state, action)=>{
    if(action.type === 'Log'){
        return action.payload;
    }
    return state;
}

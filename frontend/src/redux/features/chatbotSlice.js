import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateLastBotMessage: (state, action) => {
      // Find the last bot message
      const lastIndex = state.messages.map(m => m.sender).lastIndexOf("bot");
      if (lastIndex !== -1) {
        state.messages[lastIndex] = {
          ...state.messages[lastIndex],
          ...action.payload,
        };
      }
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, updateLastBotMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;

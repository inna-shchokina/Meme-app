import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

const MemeContext = createContext();

const initialState = {
  memes: [],
  currentMeme: null,
  text: { top: "", bottom: "" },
  gallery: [],
  searchTerm: ''
};

const memeReducer = (state, action) => {
  switch (action.type) {
    case "SET_MEMES":
      return { ...state, memes: action.payload };
    case "SET_CURRENT_MEME":
      return { ...state, currentMeme: action.payload };
    case "SET_TEXT":
      return {
        ...state,
        text: { ...state.text, [action.payload.name]: action.payload.value },
      };
    case "ADD_MEME_TO_GALLERY":
      return {
        ...state,
        gallery: [...state.gallery, action.payload],
      };
    case "SET_GALLERY":
      return {
        ...state,
        gallery: action.payload,
      };
    case "SET_SEARCH_TERM": // Добавляем обработку действия для изменения searchTerm
      return {
        ...state,
        searchTerm: action.payload,
      };
    default:
      return state;
  }
};

export const MemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(memeReducer, initialState);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await axios.get("https://api.imgflip.com/get_memes");
        const allMemes = response.data.data.memes;
        const storedGallery = JSON.parse(localStorage.getItem('memes')) || [];
  
        dispatch({ type: "SET_MEMES", payload: allMemes });
        dispatch({ type: "SET_CURRENT_MEME", payload: allMemes[Math.floor(Math.random() * allMemes.length)] });
        dispatch({ type: "ADD_MEME_TO_GALLERY", payload: storedGallery });
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchMemes();
  }, []);

  return (
    <MemeContext.Provider value={{ state, dispatch }}>
      {children}
    </MemeContext.Provider>
  );
};

export const useMemeContext = () => {
  return React.useContext(MemeContext);
};
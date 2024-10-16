import React, { createContext, useReducer, useEffect } from "react";

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
    case "set_memes":
      return { ...state, memes: action.payload };
    case "set_current_meme":
      return { ...state, currentMeme: action.payload };
    case "set_text":
      return {
        ...state,
        text: { ...state.text, [action.payload.name]: action.payload.value },
      };
    case "add_meme_to_gallery":
      return {
        ...state,
        gallery: [...state.gallery, action.payload],
      };
    case "set_gallery":
      return {
        ...state,
        gallery: action.payload,
      };
    case "set_search_term":
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
        const response = await fetch("https://api.imgflip.com/get_memes");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const allMemes = data.data.memes; 
        const storedGallery = JSON.parse(localStorage.getItem('memes')) || [];
  
        dispatch({ type: "set_memes", payload: allMemes });
        dispatch({ type: "set_current_meme", payload: allMemes[Math.floor(Math.random() * allMemes.length)] });
        dispatch({ type: "add_meme_to_gallery", payload: storedGallery });
      } catch (error) {
        console.error("Mistake:", error);
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
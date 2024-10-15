import React from "react";
import { useMemeContext } from "../components/MemeContext";
import domtoimage from 'dom-to-image';

export default function Home() {
  const { state, dispatch } = useMemeContext();
  const { currentMeme, text, memes, searchTerm } = state;

  // Обработчик изменений в поле поиска
  const handleSearchChange = (e) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  };

  // Фильтрация мемов по поисковому запросу
  const filteredMemes = searchTerm.length > 0
    ? memes.filter(meme => meme.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
    : [];

  // Переход между мемами (следующий/предыдущий)
  const nextOrPrevious = (e) => {
    const direction = e.target.name;
    const idx = memes.findIndex((el) => el === currentMeme);
    const nextMeme = idx + 1;
    const previousMeme = idx - 1;

    if (direction === "next") {
      dispatch({ type: "SET_CURRENT_MEME", payload: memes[nextMeme < memes.length ? nextMeme : 0] });
    } else {
      dispatch({ type: "SET_CURRENT_MEME", payload: memes[previousMeme >= 0 ? previousMeme : memes.length - 1] });
    }
  };

  const random = () => {
    dispatch({ type: "SET_CURRENT_MEME", payload: memes[Math.floor(Math.random() * memes.length)] });
  };

  // Обработчик изменения текста мема
  const handleChange = (e) => {
    dispatch({ type: "SET_TEXT", payload: { name: e.target.name, value: e.target.value } });
  };

  const addMemeToGallery = () => {
    const memeNode = document.getElementById('memeContainer');

    domtoimage.toPng(memeNode)
      .then((dataUrl) => {
        const newMeme = {
          name: currentMeme.name,
          date: new Date().toLocaleDateString(),
          image: dataUrl,
          addedAt: Date.now(),
          topText: text.top,
          bottomText: text.bottom
        };

        const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        const updatedMemes = [...storedMemes, newMeme];
        localStorage.setItem('memes', JSON.stringify(updatedMemes));

        dispatch({ type: "ADD_MEME_TO_GALLERY", payload: newMeme });
        alert('Meme added to gallery!');
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  };

  // Обработчик выбора мема из списка
  const handleMemeSelect = (meme) => {
    dispatch({ type: "SET_CURRENT_MEME", payload: meme });
    dispatch({ type: "SET_SEARCH_TERM", payload: '' }); // Очистка поля поиска после выбора
  };

  if (!currentMeme) return null;

  return (
    <div className="relative container flex flex-col items-center justify-center mx-auto mt-4">
      <h1 className="font-bold text-2xl text-gray-800 mt-10 mb-10">Generate a meme</h1>
  
      <input
        type="text"
        placeholder="Search memes"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input border rounded p-4 mb-4 w-[600px]"/>
  
      {/* Отображение выпадающего списка, если есть результат фильтрации */}
      {searchTerm && filteredMemes.length > 0 && (
        <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow-md">
          {filteredMemes.map(meme => (
            <li
              key={meme.id}
              onClick={() => handleMemeSelect(meme)}
              className="meme-item p-2 hover:bg-gray-200 cursor-pointer">
              {meme.name}
            </li>
          ))}
        </ul>
      )}
  
      <div className="bg-gray-100 p-6 rounded-lg mt-4 w-[600px]">
        <form className="textForm mb-4 flex flex-row items-center justify-between">
          <input
            type="text"
            placeholder="top"
            name="top"
            value={text.top}
            onChange={handleChange}
            className="border rounded p-4 mb-2 w-64"/>
          <input
            type="text"
            placeholder="bottom"
            name="bottom"
            value={text.bottom}
            onChange={handleChange}
            className="border rounded p-4 mb-2 w-64"/>
        </form>
  
        <div className="controlButtons flex space-x-4 mb-4">
          <button onClick={nextOrPrevious} name="previous" className="bg-gray-800 text-white rounded p-4 w-32 hover:bg-gray-700">
            Previous</button>
          <button onClick={random} className="bg-gray-800 text-white rounded p-4 w-32 hover:bg-gray-700">
            Random</button>
          <button onClick={nextOrPrevious} name="next" className="bg-gray-800 text-white rounded p-4 w-32 hover:bg-gray-700">
            Next</button>
          <button onClick={addMemeToGallery} className="bg-green-500 text-white rounded p-4 w-32 hover:bg-green-600">
            Add Meme</button>
        </div>
  
        <div className="memeContainer relative flex flex-col items-center" id="memeContainer">
          <h2 
            className="memeText top absolute text-white text-4xl font-bold"
            style={{ 
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              textShadow: '2px 2px 0 black',
            }}
          >
            {text.top}
          </h2>
          <img src={currentMeme.url} alt={currentMeme.name} className="meme w-[600px]" />
          <h2 
            className="memeText bottom absolute text-white text-4xl font-bold"
            style={{ 
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              textShadow: '2px 2px 0 black',
            }}
          >
            {text.bottom}
          </h2>
        </div>
      </div>
    </div>
  );
}
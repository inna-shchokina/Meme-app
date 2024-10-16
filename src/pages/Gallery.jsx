import React, { useEffect } from 'react';
import { useMemeContext } from '../MemeContext';

const Gallery = () => {
  const { state, dispatch } = useMemeContext();

  useEffect(() => {
    // Memes from Local Storage
    const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
  
    // Checking for valid images only (without date filtering)
    const validMemes = storedMemes.filter(meme => {
      const hasImage = meme.image && meme.image.trim() !== ''; 
      return hasImage; // Just check for valid images, no time limit
    });
  
    // Update the gallery with valid memes
    dispatch({ type: 'set_gallery', payload: validMemes });
    localStorage.setItem('memes', JSON.stringify(validMemes));
  }, [dispatch]);

  const localGallery = state.gallery;

  if (localGallery.length === 0) {
    return <div className="text-center p-4">
      <h1 className="font-bold text-2xl text-gray-800 mt-10 mb-10">Meme Gallery</h1>
      <div className="text-center text-lg mt-10">No memes in gallery</div>
      </div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl text-gray-800 mt-10 mb-10">Meme Gallery</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {localGallery.map((meme, index) => {
          if (!meme.image || meme.image.trim() === '') return null; // Skip memes without images

          return (
            <div key={index} className="meme-card bg-white shadow-md rounded-lg overflow-hidden">
              <img 
                src={meme.image} 
                alt={meme.name} 
                className="meme-image w-full h-48 object-cover" 
              />
              <div className="p-2">
                <h2 className="meme-name text-lg font-semibold text-left truncate">{meme.name}</h2>
                <p className="meme-date text-gray-600 text-sm text-left">
                  {meme.date ? meme.date.split(',')[0] : 'No date available'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
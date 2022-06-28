import './App.sass';

import { useState } from 'react';
import { Slider } from '../components';

const App = () => {
  const [isOpenSlider, setIsOpenSlider] = useState<boolean>(false);
  const [clikedImage, setClickedImage] = useState<number>(0);

  const [images] = useState<string[]>([
    'images/11.png',
    'images/12.png',
    'images/13.png',
    'images/14.png',
    'images/15.png',
    'images/16.png',
  ]);

  const handleOpenSlider = (e: React.MouseEvent<HTMLImageElement>) => {
    const imageIndex = Number(e.currentTarget.dataset.index) || 0;
    setClickedImage(imageIndex);
    setIsOpenSlider(true);
  };

  return (
    <div className="app">
      <div className="app__images">
        {images.map((image, index) => {
          return (
            <img
              key={image}
              className="app__image"
              src={`./${image}`}
              alt={image.replace(/\D+/g, '')}
              onClick={handleOpenSlider}
              data-index={index}
            />
          );
        })}
      </div>

      {isOpenSlider && (
        <div className="app__slider">
          <Slider
            images={images}
            activeImage={clikedImage}
            handleCloseSlider={setIsOpenSlider}
          />
        </div>
      )}
    </div>
  );
};

export default App;

import './Slider.sass';
import { FC, useState, MouseEvent, useRef, useEffect } from 'react';
import { config } from 'process';

interface SliderProps {
  images: string[];
}

interface IStartPosition {
  mouse: number;
  slider: number;
}

enum ButtonName {
  prev = 'prev',
  next = 'next',
}

const Slider: FC<SliderProps> = ({ images }) => {
  const refItems = useRef<HTMLDivElement>(null);

  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [sliderActive, setSliderActive] = useState<number>(0);

  const [mousePressed, setMousePressed] = useState<boolean>(false);
  const [startPosX, setStartPosX] = useState<IStartPosition>({
    mouse: 0,
    slider: 0,
  });

  const [offsetSlider, setOffsetSlider] = useState<number>(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // if (e.currentTarget.name === ButtonName.prev) {
    //   setOffset((currentOffset) => {
    //     const newOffset = currentOffset + sliderWidth;
    //     return Math.min(newOffset, 0);
    //   });
    // } else {
    //   setOffset((currentOffset) => {
    //     const newOffset = currentOffset - sliderWidth;
    //     const maxOffset = -((images.length - 1) * sliderWidth);
    //     return Math.max(newOffset, maxOffset);
    //   });
    // }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setMousePressed(true);
    setStartPosX({
      mouse: e.clientX,
      slider: offsetSlider,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1 && refItems.current) {
      const rect = refItems.current.getBoundingClientRect();
      const offsetMouseX = startPosX.slider - (startPosX.mouse - e.clientX);

      console.log(offsetMouseX, rect.x);

      setOffsetSlider(Math.min(offsetMouseX, 0));
    }
  };

  const handleEndClick = () => {
    setMousePressed(false);
  };

  useEffect(() => {
    refItems.current && setSliderWidth(refItems.current.offsetWidth);
  }, []);

  return (
    <div className="slider__container">
      <button
        className="slider__button slider__button--prev"
        name="prev"
        onClick={handleClick}>
        {'<'}
      </button>

      <div className="slider__window">
        <div
          className="slider__items"
          style={{ transform: `translateX(${offsetSlider}px)` }}
          ref={refItems}
          onMouseDown={handleMouseDown}
          onMouseUp={handleEndClick}
          onMouseMove={handleMouseMove}>
          {images.map((item, imdex) => (
            <div
              key={item}
              className={`slider__item slider__item__${imdex + 1}`}>
              <img
                className="slider__image"
                src={`/${item}`}
                alt={item.replace(/\D+/g, '')}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className="slider__button slider__button--next"
        name="next"
        onClick={handleClick}>
        {'>'}
      </button>
    </div>
  );
};

export default Slider;

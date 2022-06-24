import './Slider.sass';
import { FC, useState, MouseEvent, useRef, useEffect } from 'react';

enum DirectionName {
  back = 'back',
  next = 'next',
}

interface ISliderProps {
  images: string[];
}

interface IStartPosition {
  mouse: number;
  slider: number;
}

// type DirectionState = DirectionName | null;

const Slider: FC<ISliderProps> = ({ images }) => {
  const refItems = useRef<HTMLDivElement>(null);

  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [sliderActive, setSliderActive] = useState<number>(0);
  const [sliderOffset, setSliderOffset] = useState<number>(0);

  const [directionMove, setDirectionMove] = useState<DirectionName>(
    DirectionName.next,
  );

  const [startPosX, setStartPosX] = useState<IStartPosition>({
    mouse: 0,
    slider: 0,
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.name === DirectionName.back) {
      setSliderOffset((currentOffset) => {
        const newOffset = currentOffset + sliderWidth;
        return Math.min(newOffset, 0);
      });
    } else {
      setSliderOffset((currentOffset) => {
        const newOffset = currentOffset - sliderWidth;
        const maxOffset = -((images.length - 1) * sliderWidth);
        return Math.max(newOffset, maxOffset);
      });
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setStartPosX({
      mouse: e.clientX,
      slider: sliderOffset,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1 && refItems.current) {
      const maxOffset = -((images.length - 1) * sliderWidth);
      const offsetMouseX = startPosX.slider - (startPosX.mouse - e.clientX);

      setDirectionMove(() =>
        offsetMouseX <= 0 ? DirectionName.next : DirectionName.back,
      );

      setSliderOffset(() =>
        offsetMouseX < maxOffset
          ? Math.max(offsetMouseX, maxOffset)
          : Math.min(offsetMouseX, 0),
      );
    }
  };

  const handleEndClick = () => {
    const offsetMouseMove = sliderOffset % sliderWidth;
    const actualSliderNumber = sliderOffset / sliderWidth;

    // console.log(Math.abs(Math.floor(actualSliderNumber)), sliderWidth);
  };

  useEffect(() => {
    refItems.current && setSliderWidth(refItems.current.offsetWidth);
  }, []);

  return (
    <div className="slider__container">
      <button
        className="slider__button slider__button--prev"
        name={DirectionName.back}
        onClick={handleClick}>
        {'<'}
      </button>

      <div className="slider__window">
        <div
          className="slider__items"
          style={{ transform: `translateX(${sliderOffset}px)` }}
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
        name={DirectionName.next}
        onClick={handleClick}>
        {'>'}
      </button>
    </div>
  );
};

export default Slider;

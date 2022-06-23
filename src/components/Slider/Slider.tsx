import './Slider.sass';
import { FC, useState, MouseEvent, useRef } from 'react';

interface SliderProps {
  images: string[];
}

const Slider: FC<SliderProps> = ({ images }) => {
  const STEP_SLIDE = 50;
  const WIDTH_WINDOW = 450;

  const refItems = useRef<any>();

  const [item] = useState<number[]>([1, 2, 3]);
  const [mousePos, setMousePos] = useState<number>(0);

  const [offset, setOffset] = useState<number>(0);

  const setStyleWidth = () => {
    return {
      width: `${WIDTH_WINDOW}px`,
    };
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.name === 'prev') {
      setOffset((currentOffset) => {
        const newOffset = currentOffset + WIDTH_WINDOW;

        return Math.min(newOffset, 0);
      });
    } else {
      setOffset((currentOffset) => {
        const newOffset = currentOffset - WIDTH_WINDOW;
        const maxOffset = -((item.length - 1) * WIDTH_WINDOW);

        return Math.max(newOffset, maxOffset);
      });
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setMousePos(e.pageX);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      const rect = refItems.current.getBoundingClientRect();
      const x = e.clientX - rect.left;

      console.log(offset, x, e.pageX, e.clientX);

      setOffset((currentOffset) => {
        const newOffset = currentOffset + e.pageX;

        return Math.min(newOffset, 0);
      });
    }
  };

  const handleEndClick = () => {
    setMousePos(0);
  };

  return (
    <div className="slider__container" style={setStyleWidth()}>
      <button
        className="slider__button slider__button--prev"
        name="prev"
        onClick={handleClick}>
        {'<'}
      </button>

      <div className="slider__window">
        <div
          className="slider__items"
          style={{ transform: `translateX(${offset}px)` }}
          ref={refItems}
          onMouseDown={handleMouseDown}
          onMouseUp={handleEndClick}
          onMouseMove={handleMouseMove}>
          {item.map((item) => (
            <div className={`item item__${item}`} key={item}>
              {item}
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

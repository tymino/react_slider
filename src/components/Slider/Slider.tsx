import './Slider.sass';
import { FC, useState, MouseEvent, useRef, useEffect } from 'react';

interface SliderProps {
  images: string[];
}

enum ButtonName {
  prev = 'prev',
  next = 'next',
}

const Slider: FC<SliderProps> = ({ images }) => {
  const refItems = useRef<HTMLDivElement>(null);

  const [sliderWidth, setsliderWidth] = useState<number>(0);
  const [sliderActive, setSliderActive] = useState<number>(0);

  const [offset, setOffset] = useState<number>(0);

  const [mousePos, setMousePos] = useState<number>(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.name === ButtonName.prev) {
      setOffset((currentOffset) => {
        const newOffset = currentOffset + sliderWidth;

        return Math.min(newOffset, 0);
      });
    } else {
      setOffset((currentOffset) => {
        const newOffset = currentOffset - sliderWidth;
        const maxOffset = -((images.length - 1) * sliderWidth);

        return Math.max(newOffset, maxOffset);
      });
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setMousePos(e.pageX);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1 && refItems.current) {
      const rect = refItems.current.getBoundingClientRect();
      const x = e.clientX - rect.left;

      console.log(offset, x, e.pageX, e.clientX);

      setOffset((currentOffset) => {
        const newOffset = currentOffset - x;

        return Math.min(newOffset, 0);
      });
    }
  };

  const handleEndClick = () => {
    setMousePos(0);
  };

  useEffect(() => {
    refItems.current && setsliderWidth(refItems.current.offsetWidth);
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
          style={{ transform: `translateX(${offset}px)` }}
          ref={refItems}
          onMouseDown={handleMouseDown}
          onMouseUp={handleEndClick}
          onMouseMove={handleMouseMove}>
          {images.map((item) => (
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

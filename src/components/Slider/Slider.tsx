import './Slider.sass';
import { FC, useState, MouseEvent } from 'react';

interface SliderProps {
  images: string[];
}

const Slider: FC<SliderProps> = ({ images }) => {
  const [item] = useState<number[]>([1, 2, 3]);

  const [offset, setOffset] = useState(0);

  const setStyleWidth = () => {
    return {
      width: '450px',
    };
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.name === 'prev') {
      setOffset((currentOffset) => {
        const newOffset = currentOffset + 450;

        return Math.min(newOffset, 0);
      });
    } else {
      setOffset((currentOffset) => {
        const newOffset = currentOffset - 450;
        const maxOffset = -((item.length - 1) * 450);

        return Math.max(newOffset, maxOffset);
      });
    }
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
          style={{ transform: `translateX(${offset}px)` }}>
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

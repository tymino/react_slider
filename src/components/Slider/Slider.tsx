import './Slider.sass';
import { FC, useState } from 'react';

interface SliderProps {
  images: string[];
}

const Slider: FC<SliderProps> = ({ images }) => {
  const [item] = useState<number[]>([1, 2, 3]);

  return (
    <div className="slider__container">
      <div className="slider__window">
        <div className="slider__items">
          {item.map((item) => (
            <div className={`item item__${item}`}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;

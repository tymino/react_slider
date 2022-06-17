import './Slider.sass';
import { FC } from 'react';

interface SliderProps {
  images: string[];
}

const Slider: FC<SliderProps> = ({ images }) => {
  return <div className='slider__container'>slider</div>;
};

export default Slider;

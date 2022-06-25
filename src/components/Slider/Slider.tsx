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

const Slider: FC<ISliderProps> = ({ images }) => {
  const refItems = useRef<HTMLDivElement>(null);

  const [sliderWidth, setSliderWidth] = useState<number>(0);
  // const [sliderActive, setSliderActive] = useState<number>(0);
  const [sliderOffset, setSliderOffset] = useState<number>(0);
  const [sliderMaxOffset, setSliderMaxOffset] = useState<number>(0);

  const [directionMove, setDirectionMove] = useState<DirectionName>(
    DirectionName.next,
  );

  const [startPosX, setStartPosX] = useState<IStartPosition>({
    mouse: 0,
    slider: 0,
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const targetName = e.currentTarget.name;

    setSliderOffset((currentOffset) =>
      targetName === DirectionName.next
        ? Math.max(currentOffset - sliderWidth, sliderMaxOffset)
        : Math.min(currentOffset + sliderWidth, 0),
    );
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setStartPosX({
      mouse: e.clientX,
      slider: sliderOffset,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1 && refItems.current) {
      const offsetMouseX = startPosX.mouse - e.clientX;
      const offsetSliderX = startPosX.slider - offsetMouseX;

      setDirectionMove(() =>
        startPosX.mouse - e.clientX >= 0
          ? DirectionName.next
          : DirectionName.back,
      );

      setSliderOffset(() =>
        offsetSliderX < sliderMaxOffset
          ? Math.max(offsetSliderX, sliderMaxOffset)
          : Math.min(offsetSliderX, 0),
      );
    }
  };

  const handleEndClick = () => {
    const offsetMouseMove = sliderOffset % sliderWidth;

    // console.log(offsetMouseMove);

    setSliderOffset((currentOffset) => {
      if (directionMove === DirectionName.next) {
        const restOffset = sliderWidth + offsetMouseMove;
        return Math.max(currentOffset - restOffset, sliderMaxOffset);
      } else {
        const restOffset = sliderWidth - (sliderWidth + offsetMouseMove);
        return Math.min(currentOffset + restOffset, 0);
      }
    });
  };

  useEffect(() => {
    if (refItems.current) {
      const width = refItems.current.offsetWidth;
      setSliderWidth(width);
      setSliderMaxOffset(-((images.length - 1) * width));
    }
  }, [images]);

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

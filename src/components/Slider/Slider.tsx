import './Slider.sass';
import { ReactComponent as IconClose } from './icon/close.svg';
import { ReactComponent as IconArrow } from './icon/arrow.svg';
import { FC, useState, MouseEvent, useRef, useEffect, TouchEvent } from 'react';

enum DirectionName {
  back = 'back',
  next = 'next',
  null = '',
}

enum EventTypeName {
  tStart = 'touchstart',
  tMove = 'touchmove',
  mStart = 'mousedown',
  mMove = 'mousemove',
  mUp = 'mouseup',
}

interface ISliderProps {
  images: string[];
  activeImage: number;
  handleCloseSlider: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IStartPosition {
  mouse: number;
  slider: number;
}

type IEventMouseTouch = MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>;

const Slider: FC<ISliderProps> = ({
  images,
  activeImage = 0,
  handleCloseSlider,
}) => {
  const refItems = useRef<HTMLDivElement>(null);

  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [sliderOffset, setSliderOffset] = useState<number>(0);
  const [sliderMaxOffset, setSliderMaxOffset] = useState<number>(0);
  const [imageWidth, setImageWidth] = useState<number>(0);

  const [directionMove, setDirectionMove] = useState<DirectionName>(
    DirectionName.null,
  );

  const [startPosX, setStartPosX] = useState<IStartPosition>({
    mouse: 0,
    slider: 0,
  });

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    const targetName = e.currentTarget.name;

    setSliderOffset((currentOffset) =>
      targetName === DirectionName.next
        ? Math.max(currentOffset - sliderWidth, sliderMaxOffset)
        : Math.min(currentOffset + sliderWidth, 0),
    );
  };

  const handleMouseDown = (event: any) => {
    const startCoord =
      event.type === EventTypeName.tStart
        ? event.targetTouches[0].clientX
        : event.clientX;

    setStartPosX({
      mouse: startCoord,
      slider: sliderOffset,
    });
  };

  const handleMouseMove = (event: any) => {
    if (refItems.current) {
      const moveCoord =
        event.type === EventTypeName.tMove
          ? event.targetTouches[0].clientX
          : event.clientX;

      const offsetMouseX = startPosX.mouse - moveCoord;
      const offsetSliderX = startPosX.slider - offsetMouseX;

      if (event.buttons === 1 || event.type === EventTypeName.tMove) {
        setDirectionMove(() =>
          startPosX.mouse - moveCoord >= 0
            ? DirectionName.next
            : DirectionName.back,
        );

        setSliderOffset(() =>
          offsetSliderX < sliderMaxOffset
            ? Math.max(offsetSliderX, sliderMaxOffset)
            : Math.min(offsetSliderX, 0),
        );
      }
    }
  };

  const handleEndClick = (event: any) => {
    event.stopPropagation();
    const offsetMouseMove = sliderOffset % sliderWidth;

    setSliderOffset((currentOffset) => {
      switch (directionMove) {
        case DirectionName.next:
          return Math.max(
            currentOffset - (sliderWidth + offsetMouseMove),
            sliderMaxOffset,
          );

        case DirectionName.back:
          return Math.min(
            currentOffset + (sliderWidth - (sliderWidth + offsetMouseMove)),
            0,
          );

        default:
          return currentOffset;
      }
    });
    setDirectionMove(DirectionName.null);
  };

  const handleCloseButton = () => handleCloseSlider(false);

  useEffect(() => {
    const resizeWidth = () => {
      if (refItems.current) {
        const width = refItems.current.offsetWidth;
        const height = refItems.current.offsetHeight;

        if (height < width * 0.9) {
          setImageWidth(height * 0.9);
        } else {
          setImageWidth(width * 0.8);
        }

        setSliderWidth(width);
        setSliderMaxOffset(-((images.length - 1) * width));
        setSliderOffset(-(width * activeImage));
      }
    };

    resizeWidth();

    window.addEventListener('resize', resizeWidth);

    return () => window.removeEventListener('resize', resizeWidth);
  }, [activeImage, images]);

  return (
    <div
      className="slider__container"
      onMouseDown={handleMouseDown}
      onMouseUp={handleEndClick}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleEndClick}
      onTouchMove={handleMouseMove}>
      <IconClose className="slider__close" onClick={handleCloseButton} />
      <button
        className="slider__button slider__button--prev"
        name={DirectionName.back}
        onClick={handleButtonClick}>
        <IconArrow />
      </button>

      <div className="slider__window">
        <div
          className="slider__items"
          style={{ transform: `translateX(${sliderOffset}px)` }}
          ref={refItems}>
          {images.map((item, imdex) => (
            <div
              key={item}
              className={`slider__item slider__item__${imdex + 1}`}>
              <img
                width={imageWidth}
                height="auto"
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
        onClick={handleButtonClick}>
        <IconArrow />
      </button>
    </div>
  );
};

export default Slider;

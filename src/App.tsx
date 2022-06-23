import { useState } from 'react';
import { Slider } from './components';

const App = () => {
  const [images] = useState<string[]>([
    'images/11.png',
    'images/12.png',
    'images/13.png',
    'images/14.png',
    'images/15.png',
    'images/16.png',
  ]);

  return (
    <div className="app">
      <Slider images={images} />
    </div>
  );
};

export default App;

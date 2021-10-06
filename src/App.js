import './App.css';
import { OpenCvProvider } from 'opencv-react';
import Home from './pages/home';

function App() {
  const onLoaded = (cv) => {
    console.log('opencv loaded, cv')
  }

  return (
    <OpenCvProvider onLoad={onLoaded} openCvPath="/opencv/opencv.js">
      <Home />
    </OpenCvProvider>
  );
}

export default App;

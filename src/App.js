import logo from './logo.svg';
import './App.css';
import { OpenCvProvider } from 'opencv-react';
import Home from './components/home';

function App() {
  const onLoaded = (cv) => {
    console.log('opencv loaded, cv')
  }

  return (
    <OpenCvProvider onLoad={onLoaded} openCvPath="https://docs.opencv.org/master/opencv.js">
      <Home />
    </OpenCvProvider>
  );
}

export default App;

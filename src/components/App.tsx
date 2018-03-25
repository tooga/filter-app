import * as React from 'react';
import '../styles/App.css';
import TabBar from './TabBar';

const startPic = require('../assets/camera.jpg');
const startThumb = require('../assets/camera_thumb.jpg');

interface AppState {
  fitToScreen: boolean,
  dimensions: {
    containerWidth: number,
    containerHeight: number,
    xPos: number,
    yPos: number,
  },
  originalImg: string,
  thumbnailImg: string,
  filteredImg: string,
  enhancedImg: string,
  activeImg: string,
}

class App extends React.Component<{}, AppState> {

  constructor(props: AppState) {
    super(props);
    this.state = {
      fitToScreen: false,
      dimensions: {
        containerWidth: 0,
        containerHeight: 0,
        xPos: 0,
        yPos: 0,
      },
      originalImg: startPic,
      thumbnailImg: startThumb,
      filteredImg: startPic,
      enhancedImg: '',
      activeImg: startPic,
    };
  }

  render() {
    return (
      <div className="app">
        <div className="img-container" style={{ backgroundImage: `url(${this.state.activeImg})`}}>
        </div>
        <TabBar />
      </div>
    );
  }
}

export default App;

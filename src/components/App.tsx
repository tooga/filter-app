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
  userImg: {
    originalImg: string,
    thumbnailImg: string,
    filteredImg: string,
    enhancedImg: string,
    activeImg: string,
  },
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
      userImg: {
        originalImg: startPic,
        thumbnailImg: startThumb,
        filteredImg: startPic,
        enhancedImg: '',
        activeImg: startPic,
      },
    };

    this.updateImage = this.updateImage.bind(this);
    this.enhanceImage = this.enhanceImage.bind(this);
  }

  updateImage(src: string) {
    const userImg = this.state.userImg;
    userImg.filteredImg = src;
    userImg.activeImg = src;
    this.setState({
      userImg,
    });
  }

  enhanceImage(src: string) {
    const userImg = this.state.userImg;
    userImg.enhancedImg = src;
    userImg.activeImg = src;
    this.setState({
      userImg,
    });
  }

  render() {
    return (
      <div className="app">
        <div className="img-container" style={{ backgroundImage: `url(${this.state.userImg.activeImg})`}}>
        </div>
        <TabBar
          enhanceImage={this.enhanceImage}
          updateImage={this.updateImage}
          userImg={this.state.userImg}
        />
      </div>
    );
  }
}

export default App;

import * as React from 'react';
import '../styles/App.css';
import TabBar from './TabBar';

const startPic = require('../assets/camera.jpg');
const startThumb = require('../assets/camera_thumb.jpg');

interface AppState {
  userImg: {
    originalImg: string,
    thumbnailImg: string,
    filteredImg: string,
    editedImg: string,
  },
}

class App extends React.Component<{}, AppState> {

  constructor(props: AppState) {
    super(props);
    this.state = {
      userImg: {
        originalImg: startPic,
        thumbnailImg: startThumb,
        filteredImg: startPic,
        editedImg: startPic,
      },
    };
    this.filterImage = this.filterImage.bind(this);
    this.editImage = this.editImage.bind(this);
  }

  // TODO Poista suora object muokkaus, aina kopio!
  filterImage(src: string) {
    this.setState({
      userImg: { ...this.state.userImg, filteredImg: src, editedImg: src},
    });
  }

  editImage(src: string) {
    this.setState({
      userImg: { ...this.state.userImg, editedImg: src},
    });
  }

  render() {
    return (
      <div className="app">
        <div className="img-container" style={{ backgroundImage: `url(${this.state.userImg.editedImg})`}}>
        </div>
        <TabBar
          editImage={this.editImage}
          filterImage={this.filterImage}
          userImg={this.state.userImg}
        />
      </div>
    );
  }
}

export default App;

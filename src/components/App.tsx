import * as React from 'react';
import '../styles/App.css';
import TabBar from './TabBar';
import Spinner from './Spinner';

const startPic = require('../assets/camera.jpg');
const startThumb = require('../assets/camera_thumb.jpg');

interface AppState {
  userImg: {
    originalImg: string,
    thumbnailImg: string,
    filteredImg: string,
    editedImg: string,
  },
  uploadLoading: boolean,
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
      uploadLoading: false,
    };
    this.filterImage = this.filterImage.bind(this);
    this.editImage = this.editImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.setUploadLoading = this.setUploadLoading.bind(this);
  }

  filterImage(src: string) {
    this.setState({
      userImg: {
        ...this.state.userImg,
        filteredImg: src,
        editedImg: src,
      },
    });
  }

  editImage(src: string) {
    this.setState({
      userImg: {
        ...this.state.userImg,
        editedImg: src,
      },
    });
  }

  setUploadLoading() {
    this.setState({
      uploadLoading: true,
    });
  }

  uploadImage(origSrc: string, thumbnailSrc: string) {
    this.setState({
      userImg: {
        originalImg: origSrc,
        thumbnailImg: thumbnailSrc,
        filteredImg: origSrc,
        editedImg: origSrc,
      },
      uploadLoading: false,
    });
  }

  saveImage() {
    const imgContainer = document.getElementById('img-container');
    const img = document.getElementById('filtered-img') as HTMLImageElement;
    if (imgContainer && img) {
      const containerWidth = imgContainer.offsetWidth;
      const containerHeight = imgContainer.offsetHeight;
      const imgWidth = img.offsetWidth;
      const imgHeight = img.offsetHeight;
      const imgNaturalWidth = img.naturalWidth;
      const imgNaturalHeight = img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = imgNaturalWidth;
      canvas.height = imgNaturalHeight;
      let sx = 0;
      let sy = 0;
      let swidth = imgNaturalWidth;
      let sheight = imgNaturalHeight;
      if (imgWidth > containerWidth) {
        sx = ((imgWidth - containerWidth) / 2) * (imgNaturalWidth / imgWidth);
        swidth = imgNaturalWidth - (2 * sx);
        canvas.width = swidth;
      }
      if (imgHeight > containerHeight) {
        sy = ((imgHeight - containerHeight) / 2) * (imgNaturalWidth / imgWidth);
        sheight = imgNaturalHeight - (2 * sy);
        canvas.height = sheight;
      }
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(img, sx, sy, swidth, sheight, 0, 0, canvas.width, canvas.height);
      // ctx.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.setAttribute('href', dataUrl);
      link.setAttribute('download', 'img.png');
      document.body.appendChild(link); // Required for FF
      link.click(); // This will download the data file named "my_data.csv".
    }
  }

  render() {
    return (
      <div className="app">
        <div id="img-container" className="img-container">
          <img id="filtered-img" src={this.state.userImg.editedImg}/>
          {this.state.uploadLoading && <Spinner />}
        </div>
        <TabBar
          editImage={this.editImage}
          filterImage={this.filterImage}
          userImg={this.state.userImg}
          uploadImage={this.uploadImage}
          saveImage={this.saveImage}
          uploadLoading={this.setUploadLoading}
        />
      </div>
    );
  }
}

export default App;

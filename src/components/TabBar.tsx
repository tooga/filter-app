import * as React from 'react';
import FilterBar from './FilterBar';
import EditBar from './EditBar';
import { handleImgUpload } from '../utils';
import '../styles/TabBar.css';

type tabs = 'filter' | 'edit';

interface TabBarProps {
    userImg: {
        originalImg: string,
        thumbnailImg: string,
        filteredImg: string,
        editedImg: string,
    },
    filterImage: (src: string) => void,
    editImage: (src: string) => void,
    uploadImage: (origSrc: string, thumbSrc: string) => void,
    saveImage: () => void,
    uploadLoading: () => void,
}

interface TabBarState {
    activeTab: tabs,
    initFilters: boolean,
}

class TabBar extends React.Component<TabBarProps, TabBarState> {

    constructor(props: TabBarProps) {
        super(props);
        this.state = {
            activeTab: 'filter',
            initFilters: false,
        };
    }

    componentDidMount() {
        const imgUploadInput = document.getElementById('img-upload');
        if (imgUploadInput) {
            imgUploadInput.addEventListener('change', (event) => {
                handleImgUpload(event, (origSrc, thumbSrc) => {
                    this.props.uploadImage(origSrc, thumbSrc);
                    this.setState({
                        initFilters: true,
                    });
                });
            }, false);
        }
        if (this.state.initFilters) {
            this.setState({
                initFilters: false,
            });
        }
    }

    componentDidUpdate() {
        if (this.state.initFilters) {
            this.setState({
                initFilters: false,
            });
        }
    }

    setActiveTab(tab: tabs) {
        this.setState({
            activeTab: tab,
        });
    }

    render() {
        const activeTabFilter = this.state.activeTab === 'filter' ? true : false;
        const initFilters = this.state.initFilters;
        return (
            <div className="tab-bar">
                <div className="action-bar">
                    <div className="upload-btn-container">
                        <div className="upload-btn-wrapper">
                            <div className="upload-btn">
                                <i className="material-icons">add_photo_alternate</i>
                            </div>
                            <div className="btn-text">New</div>
                        </div>
                        <input id="img-upload" type="file"/>
                    </div>
                    <div className="tabs">
                        <div className={'tab ' + (activeTabFilter ? 'active' : '')} onClick={() => this.setActiveTab('filter')}>Filters</div>
                        <div className={'tab ' + (!activeTabFilter ? 'active' : '')} onClick={() => this.setActiveTab('edit')}>Edit</div>
                    </div>
                    <div className="save-btn-wrapper" onClick={this.props.saveImage}>
                        <div className="save-btn">
                            <i className="material-icons">save</i>
                        </div>
                        <div className="btn-text">Save</div>
                    </div>
                </div>
                <div className="tab-container">
                    <div className={'tab-content ' + (activeTabFilter ? '' : 'hidden')}>
                        <FilterBar initFilters={initFilters} userImg={this.props.userImg} filterImage={(src: string) => this.props.filterImage(src)}/>
                    </div>
                    <div className={'tab-content ' + (!activeTabFilter ? '' : 'hidden')}>
                        <EditBar active={!activeTabFilter} userImg={this.props.userImg} editImage={(src: string) => this.props.editImage(src)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default TabBar;

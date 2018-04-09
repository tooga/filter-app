import * as React from 'react';
import FilterBar from './FilterBar';
import EditBar from './EditBar';
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
}

interface TabBarState {
    activeTab: tabs,
}

class TabBar extends React.Component<TabBarProps, TabBarState> {

    constructor(props: TabBarProps) {
        super(props);
        this.state = {
            activeTab: 'filter',
        };
    }

    setActiveTab(tab: tabs) {
        this.setState({
            activeTab: tab,
        });
    }

    render() {
        const activeTabFilter = this.state.activeTab === 'filter' ? true : false;
        return (
            <div className="tab-bar">
                <div className="tabs">
                    <div className={'tab ' + (activeTabFilter ? 'active' : '')} onClick={() => this.setActiveTab('filter')}>Filters</div>
                    <div className={'tab ' + (!activeTabFilter ? 'active' : '')} onClick={() => this.setActiveTab('edit')}>Edit</div>
                </div>
                <div className="tab-content">
                    <div className={activeTabFilter ? '' : 'hidden'}>
                        <FilterBar active={activeTabFilter} userImg={this.props.userImg} filterImage={(src: string) => this.props.filterImage(src)}/>
                    </div>
                    <div className={!activeTabFilter ? '' : 'hidden'}>
                        <EditBar active={!activeTabFilter} userImg={this.props.userImg} editImage={(src: string) => this.props.editImage(src)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default TabBar;

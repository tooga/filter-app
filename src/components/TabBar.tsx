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
        enhancedImg: string,
        activeImg: string,
    },
    updateImage: (src: string) => void,
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
        const activeTab = this.state.activeTab;
        return (
            <div className="tab-bar">
                <div className="tabs">
                    <div className={'tab ' + (activeTab === 'filter' ? 'active' : '')} onClick={() => this.setActiveTab('filter')}>Filters</div>
                    <div className={'tab ' + (activeTab === 'edit' ? 'active' : '')} onClick={() => this.setActiveTab('edit')}>Edit</div>
                </div>
                <div className="tab-content">
                    <div className={activeTab !== 'filter' ? 'hidden' : ''}>
                        <FilterBar userImg={this.props.userImg} updateImage={(src: string) => this.props.updateImage(src)}/>
                    </div>
                    <div className={activeTab !== 'edit' ? 'hidden' : ''}>
                        <EditBar userImg={this.props.userImg} />
                    </div>
                </div>
            </div>
        );
    }
}

export default TabBar;

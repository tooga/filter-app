import * as React from 'react';
import FilterBar from './FilterBar';
import EditBar from './EditBar';
import '../styles/TabBar.css';

type tabs = 'filter' | 'edit';

interface TabBarState {
    activeTab: tabs,
}

class TabBar extends React.Component<{}, TabBarState> {

    constructor(props: {}) {
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
        const tabContent = activeTab === 'filter' ? <FilterBar /> : <EditBar />;
        return (
            <div className="tab-bar">
                <div className="tabs">
                    <div className={'tab ' + (activeTab === 'filter' ? 'active' : '')} onClick={() => this.setActiveTab('filter')}>Filters</div>
                    <div className={'tab ' + (activeTab === 'edit' ? 'active' : '')} onClick={() => this.setActiveTab('edit')}>Edit</div>
                </div>
                <div className="tab-content">
                    {tabContent}
                </div>
            </div>
        );
    }
}

export default TabBar;

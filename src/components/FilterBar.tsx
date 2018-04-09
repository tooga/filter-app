import * as React from 'react';
import { filterImage } from '../filter-lib';
import '../styles/FilterBar.css';

interface FilterObject {
    name: string,
    src: string
}

interface FilterBarProps {
    userImg: {
        originalImg: string,
        thumbnailImg: string,
    },
    active: boolean,
    filterImage: (src: string) => void,
}

interface FilterBarState {
    filters: FilterObject[],
    activeFilter: string,
}

class FilterBar extends React.Component<FilterBarProps, FilterBarState> {

    constructor(props: FilterBarProps) {
        super(props);
        this.state = {
            filters: [],
            activeFilter: 'Normal',
        };
    }

    componentDidMount() {
        this.initFilters();
    }

    initFilters() {
        const initialFilters: FilterObject[] = [
            { name: 'Normal', src: '' },
            { name: 'Inkwell', src: '' },
        ];
        // Get filters in format ./Filter.acv
        const curveFilterNames: string[] = require.context('../filter-lib/acv', false, /^\.\/.*\.acv$/).keys();
        const curveFilters: FilterObject[] = curveFilterNames.map((filterUrl: string) => {
            // Take ./ out, leaving Filter.acv
            const filterFileName = filterUrl.split('/').pop();
            // Take .acv out, leaving Filter
            const filterName = filterFileName ? filterFileName.split('.')[0] : '';
            return {
                name: filterName,
                src: '',
            };
        });
        const filters = curveFilters.concat(initialFilters);
        // Sort filters, put "Normal" to beginning
        filters.sort((a: FilterObject, b: FilterObject) => {
            if (a.name === 'Normal') {
                return -1;
            }
            if (b.name === 'Normal') {
                return 1;
            }
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });
        this.setState({
            filters,
        }, () => {
            this.updateFilters();
        });
    }

    updateFilters() {
        let counter = 0;
        const filters = this.state.filters;
        const thumbnailImg = this.props.userImg.thumbnailImg;
        filters.forEach((filter) => {
            filterImage(thumbnailImg, filter.name, (src) => {
                counter++;
                filter.src = src;
                if (filters.length === counter) {
                    this.setState({
                        filters,
                        activeFilter: 'Normal',
                    });
                }
            });
        });
    }

    onThumbnailClick(filterName: string) {
        this.applyFilter(filterName);
        this.setState({
            activeFilter: filterName,
        });
    }

    applyFilter(filterName: string) {
        const originalImg = this.props.userImg.originalImg;
        filterImage(originalImg, filterName, (src) => {
            this.props.filterImage(src);
        });
    }

    renderFilters() {
        return this.state.filters.map(filter => {
            return (
                <div className="filter-container" key={filter.name}>
                    <div
                        className={'filter-img-container ' + (this.state.activeFilter === filter.name ? 'active' : '')}
                        style={{backgroundImage: `url(${filter.src})`}}
                        onClick={() => this.onThumbnailClick(filter.name)}
                    />
                    <div className="filter-name">{filter.name}</div>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="filter-bar-container">
                {this.renderFilters()}
            </div>
        );
    }
}

export default FilterBar;

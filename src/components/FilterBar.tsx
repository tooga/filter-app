import * as React from 'react';
import { filterImage } from '../filter-lib';
import '../styles/FilterBar.css';

interface FilterObject {
    name: string,
    src: null | string
}

interface FilterBarProps {
    userImg: {
        originalImg: string,
        thumbnailImg: string,
        filteredImg: string,
        enhancedImg: string,
        activeImg: string,
    },
    updateImage: (src: string) => void,
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
            { name: 'Normal', src: null },
            { name: 'Inkwell', src: null },
        ];
        const curveFilterNames: string[] = require.context('../filter-lib/acv', false, /^\.\/.*\.acv$/).keys();
        const curveFilters: FilterObject[] = curveFilterNames.map((filterUrl: string) => {
            // TODO fix
            const split = filterUrl.split('/').pop();
            return {
                name: split ? split.split('.')[0] : '',
                src: null,
            };
        });
        const filters = curveFilters.concat(initialFilters);
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
        filters.forEach((filter) => {
            filterImage(this.props.userImg.thumbnailImg, filter.name, (src) => {
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
        filterImage(this.props.userImg.originalImg, filterName, (src) => {
            this.props.updateImage(src);
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

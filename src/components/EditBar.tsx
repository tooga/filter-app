import * as React from 'react';
import { enhanceImage } from '../filter-lib';
import '../styles/EditBar.css';

interface EditBarProps {
    userImg: {
        originalImg: string,
        thumbnailImg: string,
        filteredImg: string,
        enhancedImg: string,
        activeImg: string,
    },
    updateImage: (src: string) => void,
}

interface Enhancement {
    name: string,
    icon: string,
    value: number,
    range?: {
        min: string,
        max: string,
    },
    valueDivider?: number
}

interface EditBarState {
    selectedEnhancement: Enhancement | null,
    origEnhancementValue: number,
}

const enhancements: Enhancement[] = [
    {name: 'brightness', icon: 'wb_sunny', value: 0, range: {min: '-100', max: '100'}},
    {name: 'clip', icon: 'gradient', value: 0, range: {min: '0', max: '100'}},
    {name: 'contrast', icon: 'tonality', value: 0, range: {min: '-100', max: '100'}},
    {name: 'exposure', icon: 'exposure', value: 0, range: {min: '-100', max: '100'}},
    {name: 'gamma', icon: 'assistant', value: 0, range: {min: '0', max: '50'}, valueDivider: 10},
    {name: 'hue', icon: 'colorize', value: 0, range: {min: '0', max: '100'}},
    {name: 'noise', icon: 'blur_on', value: 0, range: {min: '0', max: '100'}},
    {name: 'saturation', icon: 'brightness_medium', value: 0, range: {min: '-100', max: '100'}},
    {name: 'sepia', icon: 'monochrome_photos', value: 0, range: {min: '0', max: '100'}},
    {name: 'vibrance', icon: 'tonality', value: 0, range: {min: '-100', max: '100'}},
    {name: 'greyscale', icon: 'invert_colors_off', value: 0},
    {name: 'invert', icon: 'compare', value: 0},
];

class EditBar extends React.Component<EditBarProps, EditBarState> {

    constructor(props: EditBarProps) {
        super(props);
        this.state = {
            selectedEnhancement: null,
            origEnhancementValue: 0,
        };
    }

    onThumbnailClick(enhancement: Enhancement) {
        if (enhancement.range) {
            this.setState({
                selectedEnhancement: enhancement,
                origEnhancementValue: enhancement.value,
            });
            this.applyEnhancement();
        } else {
            enhancement.value = enhancement.value ? 0 : 1;
            enhanceImage(this.props.userImg.filteredImg, enhancements, (src) => {
                this.props.updateImage(src);
            });
        }
    }

    onCancelClick() {
        const selectedEnhancement = this.state.selectedEnhancement;
        if (selectedEnhancement) {
            selectedEnhancement.value = this.state.origEnhancementValue;
        }
        this.applyEnhancement();
        this.setState({
            selectedEnhancement: null,
            origEnhancementValue: 0,
        });
    }

    applyEnhancement() {
        enhanceImage(this.props.userImg.filteredImg, enhancements, (src) => {
            this.props.updateImage(src);
        });
    }

    onSliderChange(event: any) {
        const sliderValue = parseInt(event.target.value, 10);
        const selectedEnhancement = this.state.selectedEnhancement;
        if (selectedEnhancement) {
            selectedEnhancement.value = sliderValue;
        }
        this.applyEnhancement();
        this.setState({
            selectedEnhancement,
        });
    }

    onConfirmClick() {
        this.setState({
            selectedEnhancement: null,
            origEnhancementValue: 0,
        });
    }

    onSliderResetClick() {
        const selectedEnhancement = this.state.selectedEnhancement;
        if (selectedEnhancement) {
            selectedEnhancement.value = 0;
        }
        this.applyEnhancement();
        this.setState({
            selectedEnhancement,
        });
    }

    renderEnhancements() {
        return enhancements.map(enhancement => {
            return (
                <div className="enhancement-container" key={enhancement.name}>
                    <div
                        className={'enhancement-icon-container' + (enhancement.value  ? 'active' : '')}
                        onClick={this.onThumbnailClick.bind(this, enhancement)}
                    >
                        <i className="material-icons">{enhancement.icon}</i>
                    </div>
                    <div className="enhancement-name">{enhancement.name}</div>
                </div>
            );
        });
    }

    render() {
        const selectedEnhancement = this.state.selectedEnhancement;
        return (
            <div className="edit-bar-container">
                {!selectedEnhancement ?
                    <div className="enhancements">
                        {this.renderEnhancements()}
                    </div>
                :
                    <div className="edit-slider-container">
                        <p className="range-field">
                            <input
                                type="range"
                                min={selectedEnhancement.range ? selectedEnhancement.range.min : 0}
                                max={selectedEnhancement.range ? selectedEnhancement.range.max : 0}
                                value={selectedEnhancement.value}
                                onChange={(event: any) => this.onSliderChange(event)}
                            />
                        </p>
                         <div className="slider-btn-container">
                            <i className="material-icons slider-icon" onClick={() => this.onCancelClick()}>cancel</i>
                            <div className="title-container">
                                <div className="enhancement-title">{selectedEnhancement.name}</div>
                                <a className="waves-effect waves-light btn-flat reset-btn" onClick={() => this.onSliderResetClick()}>Reset</a>
                            </div>
                            <i className="material-icons slider-icon" onClick={() => this.onConfirmClick()}>check_circle</i>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default EditBar;

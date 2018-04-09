import * as React from 'react';
import { enhanceImage as editImage } from '../filter-lib';
import '../styles/EditBar.css';

interface EditBarProps {
    userImg: {
        originalImg: string,
        thumbnailImg: string,
        filteredImg: string,
        editedImg: string,
    },
    active: boolean,
    editImage: (src: string) => void,
}

interface EditObject {
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
    activeEdit: EditObject | null,
    originalEditValue: number,
    tempEditedImage: string,
}

const edits: EditObject[] = [
    {name: 'brightness', icon: 'wb_sunny', value: 0, range: {min: '-100', max: '100'}},
    {name: 'clip', icon: 'gradient', value: 0, range: {min: '0', max: '100'}},
    {name: 'contrast', icon: 'tonality', value: 0, range: {min: '-100', max: '100'}},
    {name: 'exposure', icon: 'exposure', value: 0, range: {min: '-100', max: '100'}},
    {name: 'gamma', icon: 'assistant', value: 0, range: {min: '0', max: '50'}, valueDivider: 10},
    {name: 'greyscale', icon: 'invert_colors_off', value: 0},
    {name: 'hue', icon: 'colorize', value: 0, range: {min: '0', max: '100'}},
    {name: 'invert', icon: 'compare', value: 0},
    {name: 'noise', icon: 'blur_on', value: 0, range: {min: '0', max: '100'}},
    {name: 'saturation', icon: 'brightness_medium', value: 0, range: {min: '-100', max: '100'}},
    {name: 'sepia', icon: 'monochrome_photos', value: 0, range: {min: '0', max: '100'}},
    {name: 'vibrance', icon: 'tonality', value: 0, range: {min: '-100', max: '100'}},
];

class EditBar extends React.Component<EditBarProps, EditBarState> {

    constructor(props: EditBarProps) {
        super(props);
        this.state = {
            activeEdit: null,
            originalEditValue: 0,
            tempEditedImage: '',
        };
    }

    componentWillReceiveProps(nextProps: EditBarProps) {
        if (this.props.userImg.filteredImg !== nextProps.userImg.filteredImg) {
            edits.forEach((edit) => {
                edit.value = 0;
            });
        }

        if (this.props.active && !nextProps.active) {
            this.onCancelClick();
        }
    }

    onThumbnailClick(edit: EditObject) {
        if (edit.range) {
            // Get version of edited image, where the clicked edit has not been applied to the img
            if (edit.value === 0) {
                this.setState({
                    activeEdit: edit,
                    originalEditValue: edit.value,
                    tempEditedImage: this.props.userImg.editedImg,
                });
            } else {
                const editsClone = JSON.parse(JSON.stringify(edits));
                const tempEdits = editsClone.filter((editObj: EditObject) => {
                    return editObj.name !== edit.name;
                });
                const filteredImg = this.props.userImg.filteredImg;
                editImage(filteredImg, tempEdits, (src) => {
                    this.setState({
                        activeEdit: edit,
                        originalEditValue: edit.value,
                        tempEditedImage: src,
                    });
                });
            }
        } else {
            edit.value = edit.value ? 0 : 1;
            const filteredImg = this.props.userImg.filteredImg;
            this.applyEdit(filteredImg, edits);
        }
    }

    onCancelClick() {
        const activeEdit = this.state.activeEdit;
        if (activeEdit) {
            activeEdit.value = this.state.originalEditValue;
            const editedImg = this.state.tempEditedImage;
            if (activeEdit.value !== 0) {
                this.applyEdit(editedImg, [activeEdit]);
            } else {
                this.props.editImage(editedImg);
            }
        }
        this.setState({
            activeEdit: null,
            originalEditValue: 0,
            tempEditedImage: '',
        });
    }

    applyEdit(image: string, editObjects: EditObject[]) {
        editImage(image, editObjects, (src) => {
            this.props.editImage(src);
        });
    }

    onSliderChange(event: any) {
        const sliderValue = parseInt(event.target.value, 10);
        const activeEdit = this.state.activeEdit;
        if (activeEdit) {
            const editedImage = this.state.tempEditedImage;
            activeEdit.value = sliderValue;
            this.applyEdit(editedImage, [activeEdit]);
        }
        this.setState({
            activeEdit,
        });
    }

    onConfirmClick() {
        this.setState({
            activeEdit: null,
            originalEditValue: 0,
            tempEditedImage: '',
        });
    }

    /*onSliderResetClick() {
        const activeEdit = this.state.activeEdit;
        if (activeEdit) {
            activeEdit.value = 0;
        }
        this.applyEdit();
        this.setState({
            activeEdit,
        });
    }*/

    renderEdits() {
        return edits.map(edit => {
            return (
                <div className="edit-container" key={edit.name}>
                    <div
                        className={'edit-icon-container ' + (edit.value  ? 'active' : '')}
                        onClick={this.onThumbnailClick.bind(this, edit)}
                    >
                        <i className="material-icons">{edit.icon}</i>
                    </div>
                    <div className="edit-name">{edit.name}</div>
                </div>
            );
        });
    }

    render() {
        const activeEdit = this.state.activeEdit;
        return (
            <div className="edit-bar-container">
                {!activeEdit ?
                    <div className="edits">
                        {this.renderEdits()}
                    </div>
                :
                    <div className="edit-slider-container">
                        <p className="range-field">
                            <input
                                type="range"
                                min={activeEdit.range ? activeEdit.range.min : 0}
                                max={activeEdit.range ? activeEdit.range.max : 0}
                                value={activeEdit.value}
                                onChange={(event: any) => this.onSliderChange(event)}
                            />
                        </p>
                         <div className="slider-btn-container">
                            <i className="material-icons slider-icon" onClick={() => this.onCancelClick()}>clear</i>
                            <div className="title-container">
                                <div className="edit-value center">{activeEdit.value}</div>
                                <div className="edit-title">{activeEdit.name}</div>
                            </div>
                            <i className="material-icons slider-icon" onClick={() => this.onConfirmClick()}>check</i>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default EditBar;

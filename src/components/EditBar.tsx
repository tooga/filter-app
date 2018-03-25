import * as React from 'react';

interface EditBarProps {
    userImg: {
        originalImg: string,
        thumbnailImg: string,
        filteredImg: string,
        enhancedImg: string,
        activeImg: string,
    }
}

class EditBar extends React.Component<EditBarProps, {}> {

    constructor(props: EditBarProps) {
        super(props);
    }

    render() {
        return (
            <div className="edit-bar-container">
                Edit
            </div>
        );
    }
}

export default EditBar;

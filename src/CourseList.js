import * as React from "react";
import List from "@mui/material/List";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CourseItem from "./CourseItem"


export default function CheckboxListSecondary(props) {
    const {items, checked, toggleCallback, selectIcon, selectCheckedIcon, useSwitch} = props;

    if (items.length === 0) {
        return (<div>
            <p>No items to show</p>
        </div>)
    }

    return (
        <div>
            <List
                dense
                sx={{width: "100%", maxWidth: 360, bgcolor: "background.paper"}}
            >
                {items.map((course) => {
                    return (
                        <CourseItem
                            key={course.id}
                            checked={checked.indexOf(course.id) !== -1}
                            toggleCallback={toggleCallback(course)}
                            selectIcon={selectIcon}
                            selectCheckedIcon={selectCheckedIcon}
                            useSwitch={useSwitch}
                            course={course}
                        />
                    );
                })}
            </List>
        </div>
    );
}

CheckboxListSecondary.defaultProps = {
    toggleCallback: (value, state) => {
        return null
    },
    selectIcon: <CheckBoxOutlineBlankIcon/>,
    selectCheckedIcon: <CheckBoxIcon/>,
    useSwitch: false
}


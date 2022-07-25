import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import Typography from '@mui/material/Typography';
import {Avatar, ListItemAvatar} from "@mui/material";


export default function CourseItem(props) {
    const {course, checked, toggleCallback, selectIcon, selectCheckedIcon, useSwitch} = props;

    const labelId = `checkbox-list-secondary-label-${course.name}`;

    const handleToggle = () => {
        toggleCallback(course);
    };

    const getSecondary = (value, labelId) => {
        if (useSwitch) {
            return (<Switch
                edge="end"
                onChange={handleToggle}
                checked={checked}
                inputProps={{"aria-labelledby": labelId}}
            />);
        } else {
            return (<Checkbox
                edge="end"
                onChange={handleToggle}
                checked={checked}
                inputProps={{"aria-labelledby": labelId}}
                icon={selectIcon}
                checkedIcon={selectCheckedIcon}
            />)
        }
    };

    const avatar = (
        <ListItemAvatar>
            <Avatar alt={course.school} src={require(`./static/images/avatar/${course.school}.jpg`)} />
        </ListItemAvatar>
    );

    return (
        <ListItem
            secondaryAction={getSecondary(course.name, labelId)}
            onClick={handleToggle}
        >
            {avatar}
            <ListItemButton>
                <ListItemText id={labelId}
                              primary={`${course.semester === "S" ? "🌻" : "🍁"}  ${course.name}`}
                              secondary={
                                  <React.Fragment>
                                      <Typography
                                          sx={{display: 'inline'}}
                                          component="span"
                                          variant="body2"
                                          color="text.primary"
                                      >
                                          {course.prof}
                                          <br/>
                                      </Typography>
                                      {course.timeText}
                                  </React.Fragment>
                              }
                />
            </ListItemButton>

        </ListItem>
    )
};
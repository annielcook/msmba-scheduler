import {styled} from "@mui/material/styles";
import {Appointments, WeekView} from "@devexpress/dx-react-scheduler-material-ui";
import {amber, cyan, deepOrange, lightGreen} from "@mui/material/colors";
import * as React from "react";

const classes = {
    HBS: `SchoolName-HBS`,
    SEAS: `SchoolName-SEAS`,
    MIT: `SchoolName-MIT`,
    MSMBAENG: "SchoolName-MSMBAENG"
};

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(
    ({theme}) => ({
        [`.Cell-dayOfWeek`]: {
            fontWeight: 400,
            fontSize: "1.8rem",
            lineHeight: 1.2
        },
        [`.Cell-dayOfMonth`]: {
            display: "none"
        }
    })
);

const StyledAppointment = styled(Appointments.Appointment)(
    ({theme}) => ({
        [`&.${classes.HBS}`]: {
            backgroundColor: deepOrange[500],
            '&:hover': {
                backgroundColor: deepOrange[600]
            }
        },
        [`&.${classes.SEAS}`]: {
            backgroundColor: amber[500],
            '&:hover': {
                backgroundColor: amber[600]
            }
        },
        [`&.${classes.MIT}`]: {
            backgroundColor: cyan[500],
            '&:hover': {
                backgroundColor: cyan[600]
            }
        },
        [`&.${classes.MSMBAENG}`]: {
            backgroundColor: lightGreen[500],
            '&:hover': {
                backgroundColor: lightGreen[600]
            }
        }

    })
);

export const DayScaleCell = (props) => {
    return <StyledWeekViewDayScaleCell {...props} />;
};

export const Appointment = ({ data, ...restProps }) => {
    return <StyledAppointment className={classes[data.school]} {...restProps} />;
}

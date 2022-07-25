import * as React from "react";
import Paper from "@mui/material/Paper";
import {styled} from "@mui/material/styles";
import {ViewState} from "@devexpress/dx-react-scheduler";
import {Appointments, Scheduler, Toolbar, WeekView, TodayButton} from "@devexpress/dx-react-scheduler-material-ui";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import { amber, deepOrange, cyan } from '@mui/material/colors';

const daysFall = ["2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06"]
const daysSpring = ["2023-01-09", "2023-01-10", "2023-01-11", "2023-01-12", "2023-01-13"]

const classes = {
    HBS: `SchoolName-HBS`,
    SEAS: `SchoolName-SEAS`,
    MIT: `SchoolName-MIT`,
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
        }
    })
);

const DayScaleCell = (props) => {
    return <StyledWeekViewDayScaleCell {...props} />;
};

const Appointment = ({ data, ...restProps }) => {
    return <StyledAppointment className={classes[data.school]} {...restProps} />;
}

function getCalendarData(course) {
    return course.times.map((time) => {
        const {day, startHour, endHour} = time;
        const semester = course.semester;
        if (semester === 'F') {
            const date = daysFall[day];
            return {
                startDate: `${date}T${startHour}`,
                endDate: `${date}T${endHour}`,
                title: course.name,
                school: course.school
            };
        } else if (semester === 'S') {
            const date = daysSpring[day];
            return {
                startDate: `${date}T${startHour}`,
                endDate: `${date}T${endHour}`,
                title: course.name,
                school: course.school
            };
        } else {
            return null;
        }
    });
}

export default function Calendar(props) {
    const [semester, setSemester] = React.useState("Fall");
    const {courses} = props;
    const data = courses.map(getCalendarData).flat();


    const CustomButtonTest = (({ getMessage, setCurrentDate, ...restProps},) => {
        const handleChange = (
            event: React.MouseEvent<HTMLElement>,
            newSemester: string,
        ) => {
            setSemester(newSemester === "Spring" ? daysSpring[0] : daysFall[0])
            setSemester(newSemester)
        };

        return (
            <ToggleButtonGroup
                value={semester}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton value="Fall">Fall 🍁</ToggleButton>
                <ToggleButton value="Spring">Spring 🌻</ToggleButton>
            </ToggleButtonGroup>
        )
    });

    return (
        <Paper>
            <Scheduler data={data}>
                <ViewState
                    currentDate={semester === "Fall" ? daysFall[0] : daysSpring[0]}
                />
                <WeekView
                    startDayHour={8}
                    endDayHour={20}
                    excludedDays={[0, 6]}
                    dayScaleCellComponent={DayScaleCell}
                    cellDuration={60}
                />
                <Appointments
                    appointmentComponent={Appointment}
                />
                <Toolbar/>
                <TodayButton
                    buttonComponent={CustomButtonTest}
                />
            </Scheduler>
        </Paper>)
};

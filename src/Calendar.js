import * as React from "react";
import Paper from "@mui/material/Paper";
import {ViewState} from "@devexpress/dx-react-scheduler";
import {Appointments, Scheduler, Toolbar, WeekView, TodayButton} from "@devexpress/dx-react-scheduler-material-ui";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Appointment, DayScaleCell} from "./CalendarStyles";

const daysFall = ["2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05", "2023-01-06"]
const daysSpring = ["2023-01-09", "2023-01-10", "2023-01-11", "2023-01-12", "2023-01-13"]


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

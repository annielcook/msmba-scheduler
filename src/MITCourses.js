import getTimeText from "./CoursesTimeText";
import moment from "moment";
import {hourFormat, mitCoursesJsonURL} from "./Consts";
import {getJson} from "./IO";


const days = {
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4,
}

const unknownTimes = ["Not available. Please refer to official catalog.", "To be arranged", "TBD TBD", "Unscheduled"]

function getCourseEntryId(courseEntry) {
    if (courseEntry.type === "Class") {
        return courseEntry.id;
    } else if (courseEntry.type === "LectureSession") {
        return courseEntry["lecture-section-of"];
    } else if (courseEntry.type === "LabSession") {
        return courseEntry["lab-section-of"];
    } else if (courseEntry.type === "RecitationSession") {
        return courseEntry["rec-section-of"];
    }
}

function getAllCourses(mitCoursesJson) {
    let allCourses = {};
    mitCoursesJson.items.forEach((courseEntry) => {
        const courseId = getCourseEntryId(courseEntry);
        if (!(courseId in allCourses)) {
            allCourses[courseId] = {class: null, others: [], lectures: []};
        }
        if (courseEntry.type === "Class") {
            allCourses[courseId].class = courseEntry;
        } else if (courseEntry.type === "LectureSession") {
            allCourses[courseId].lectures.push(courseEntry);
        } else {
            allCourses[courseId].others.push(courseEntry);
        }
    });
    return Object.values(allCourses).filter(e => (e.class.semester.includes("Fall") && e.lectures.length > 0));
}

function parseHourString(hourString) {
    const hour = moment(hourString, 'hh.mm');
    if (hour.hour() < 8) {
        hour.add(12, 'hours');
    }
    return hour;
}

function parseCourseTime(timeStr) {
    const match = timeStr.match('([MTWRF]+) ?( EVE \\()?([0-9]+\\.?:?[0-9]*)-?([0-9]+\\.?[0-9]*)?');
    const courseDays = match[1].split("");
    const startTime = parseHourString(match[3]);
    let endTime;
    if (match[4] === undefined) {
        endTime = startTime.add(1, "hour");
    } else {
        endTime = parseHourString(match[4]);
    }
    const startHour = startTime.format(hourFormat);
    const endHour = endTime.format(hourFormat);

    return courseDays.map((day) => (
        {
            day: days[day],
            startHour: startHour,
            endHour: endHour
        }
    ))
}

function getCourseTimes(courseData) {
    return courseData.lectures.map((lecture) => {
        const timeStr = lecture.timeAndPlace;
        if (unknownTimes.includes(timeStr) || timeStr.startsWith("Unscheduled")) {
            return null;
        }
        return parseCourseTime(lecture.timeAndPlace)
    }).flat().filter(e=> (e!==null));
}

function parseCourse(courseData) {
    const times = getCourseTimes(courseData);
    if (times.length === 0) {
        return null;
    }
    let instructor;
    if ("Instructor" in courseData.class) {
        instructor = courseData.class.Instructor.join(", ");
    } else {
        instructor = "Unknown";
    }
    return {
        id: `MIT-${courseData.class.id}`,
        name: `${courseData.class.id} ${courseData.class.label}`,
        school: "MIT",
        prof: instructor,
        timeText: getTimeText(times),
        semester: "F", // MIT courses show only schedule for 1 semester ahead
        times: times
    };
}

export async function getMITCourses(jsonFile) {
    const allCourses = getAllCourses(jsonFile);
    return allCourses.map((course) => parseCourse(course)).filter(e => (e !== null));
}

export const exportedForTesting = {
    getAllCourses, parseCourse
}
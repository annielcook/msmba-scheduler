import getTimeText from "./CoursesTimeText";
import {parseCourseTime} from "./MITCourses";


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

function getCourseTimes(courseData) {
    return courseData.lectures.map((lecture) => {
        const timeStr = lecture.timeAndPlace;
        if (unknownTimes.includes(timeStr) || timeStr.startsWith("Unscheduled")) {
            return null;
        }
        return parseCourseTime(lecture.timeAndPlace)
    }).flat().filter(e => (e !== null));
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
        semester: "F", // MIT-2022 courses show only schedule for 1 semester ahead
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
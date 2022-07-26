import {currentAcademicYear, hourFormat, seasCoursesListURL, seasCoursesScheduleURL} from "./Consts";
import moment from "moment";
import getTimeText from "./CoursesTimeText";
import {getJson} from "./IO";

const days = {
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4,
}

function getCompleteRawCoursesInfo(rawCoursesList, rawCoursesSchedule) {
    let completeCoursesMap = {};
    for (const courseInfo of rawCoursesList) {
        completeCoursesMap[courseInfo.courseNumber] = {...courseInfo};
    }
    for (const courseTimes of rawCoursesSchedule) {
        if (courseTimes.courseNumber in completeCoursesMap) {
            completeCoursesMap[courseTimes.courseNumber].semesterTimes = [...courseTimes.semesters];
            completeCoursesMap[courseTimes.courseNumber].isUndergraduate = courseTimes.isUndergraduate;
        }
    }
    return Object.values(completeCoursesMap).filter(e => ("semesterTimes" in e));
}

function getRelevantSemestersInfo(courseData) {
    let semestersInfo = [
        {year: currentAcademicYear, term: "Fall", instructors: [], times: []},
        {year: currentAcademicYear, term: "Spring", instructors: [], times: []},
    ];
    const instructorsFall = courseData.semesters.filter(e =>
        (e.offeredStatus === "Yes" && e.academicYear === semestersInfo[0].year && e.term === semestersInfo[0].term));
    const instructorsSpring = courseData.semesters.filter(e =>
        (e.offeredStatus === "Yes" && e.academicYear === semestersInfo[1].year && e.term === semestersInfo[1].term));
    const timesFall = courseData.semesterTimes.filter(e =>
        (e.academicYear === semestersInfo[0].year && e.term === semestersInfo[0].term));
    const timesSpring = courseData.semesterTimes.filter(e =>
        (e.academicYear === semestersInfo[1].year && e.term === semestersInfo[1].term));

    if (instructorsFall.length > 0 && timesFall.length > 0) {
        semestersInfo[0].instructors = instructorsFall[0].instructors;
        semestersInfo[0].times = timesFall[0].times;
    }

    if (instructorsSpring.length > 0 && timesSpring.length > 0) {
        semestersInfo[1].instructors = instructorsSpring[0].instructors;
        semestersInfo[1].times = timesSpring[0].times;
    }

    return semestersInfo.filter(e => (e.instructors.length > 0));
}

function instructorsToString(instructorsList) {
    return instructorsList.map((instructor) => (`${instructor.firstName} ${instructor.lastName}`)).join(', ');
}

function parseTimes(timesList) {
    return timesList.map((time) => {
        const startHour = moment.utc(time.startTime*60*1000).format(hourFormat);
        const endHour = moment.utc(time.endTime*60*1000).format(hourFormat);
        return time.days.split("").map((day) => {
            return {
                day: days[day],
                startHour: startHour,
                endHour: endHour
            }
        });
    }).flat();
}

function parseCourse(courseData) {
    const semestersInfos = getRelevantSemestersInfo(courseData);
    return semestersInfos.map((semesterInfo) => {
        const times = parseTimes(semesterInfo.times);
        return {
            id: `SEAS-${semesterInfo.term}-${courseData.courseNumber.replace(' ', '-')}`,
            name: `${courseData.courseNumber} ${courseData.title}`,
            school: "SEAS",
            prof: instructorsToString(semesterInfo.instructors),
            timeText: getTimeText(times),
            semester: semesterInfo.term.slice(0,1),
            times: times
        };
    });
}

export async function getSEASCoursesFromURL() {
    const rawCoursesList = await getJson(seasCoursesListURL);
    const rawCoursesSchedule = await getJson(seasCoursesScheduleURL);
    return getSEASCoursesFromJsons(rawCoursesList, rawCoursesSchedule);
}

export function getSEASCoursesFromJsons(coursesListJson, coursesScheduleJson) {
    const completeCoursesInfo = getCompleteRawCoursesInfo(coursesListJson, coursesScheduleJson);
    return completeCoursesInfo.map((course) => (parseCourse(course))).flat();
}

export const exportedForTesting = {
    parseCourse, getCompleteRawCoursesInfo, getRelevantSemestersInfo
};
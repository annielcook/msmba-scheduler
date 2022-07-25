import Papa from "papaparse";
import {hourFormat} from "./Consts";
import moment from "moment";
import getTimeText from "./CoursesTimeText";


const days = {
    X: [0, 1],
    Y: [3, 4],
    M: [0],
    T: [1],
    W: [2],
    H: [3],
    F: [4],
}

export function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status===200) {
        result = xmlhttp.responseText;
    }
    return result;
}

const readCSV = async (csvData) => {
    return new Promise(resolve => {
        Papa.parse(csvData, {
            header: true,
            complete: results => {
                console.log('Complete', results.data.length, 'records.');
                resolve(results.data);
            }
        });
    });
};

function getCourseHours(startRaw) {
    const courseStartHour = moment(startRaw, "hh:mm:ss A");
    return {
        startHour: courseStartHour.format(hourFormat),
        endHour: courseStartHour.add(80, 'm').format(hourFormat)
    };
}

function parseCourse(courseData) {
    let courseHours = days[courseData.Day].map((day) => {
        return {
            ...getCourseHours(courseData.Start),
            day: day
        }
    });
    if (courseData.OtherEventsDay !== "") {
        courseHours = courseHours.concat(days[courseData.OtherEventsDay].map((day) => {
            return {
                ...getCourseHours(courseData.OtherEventsStart),
                day: day
            };
        }));
    }

    return {
        id: `HBS-${courseData.SectionID}`,
        name: courseData.LongCourseTitle,
        school: "HBS",
        prof: courseData.Faculty,
        timeText: getTimeText(courseHours),
        semester: courseData.Term.slice(0,1),
        times: courseHours
    }
}


export async function parseCourses(filepath) {
    const rawCourses = await readCSV(filepath);
    return rawCourses.map(parseCourse);
}

export const exportedForTesting = {
    readCSV, parseCourse
};

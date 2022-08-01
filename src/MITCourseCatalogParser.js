import getTimeText from "./CoursesTimeText";
import {parseCourseTime} from "./MITCourses";


export function parseCourse(courseData) {
    const times = parseCourseTime(courseData.times)
    return {
        id: `MIT-${courseData.name.split(" ")[0]}`,
        name: courseData.name,
        school: "MIT",
        prof: courseData.prof,
        timeText: getTimeText(times),
        semester: courseData.semester,
        times: times
    }
}

export function parseCoursesJsons(jsons) {
    return jsons.map(
        courses => (courses.map(
            course => (parseCourse(course)))))
        .flat()
}
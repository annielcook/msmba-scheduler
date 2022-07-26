import {exportedForTesting} from "./MITCourses";

const {getAllCourses, parseCourse} = exportedForTesting;

const dummyJson = {
    items: [
        {
            "type": "LectureSession",
            "label": "L011.00",
            "timeAndPlace": "MW9.30-11 1-390",
            "in-charge": "undefined (Class Admin)",
            "lecture-section-of": "1.00"
        },
        {
            "type": "Class",
            "id": "1.00",
            "label": "Engineering Computation and Data Science",
            "shortLabel": "Eng Computation & Data Science",
            "level": "Undergraduate",
            "total-units": 12,
            "units": "3-2-7",
            "course": "1",
            "description": "Presents engineering problems in a computational setting with emphasis on data science and problem abstraction.&nbsp;Covers exploratory data analysis and visualization, filtering, regression. Building basic machine learning models (classifiers, decision trees, clustering) for smart city applications. Labs and programming projects focused on analytics problems faced by cities, infrastructure, and environment. Students taking graduate version complete additional assignments and project work.",
            "prereqs": "<a href='javascript:{}' onclick='showPrereq(this, \"18.01\", null);'>18.01</a> or <a href='javascript:{}' onclick='showPrereq(this, \"18.014\", null);'>18.014</a> or <a href='javascript:{}' onclick='showPrereq(this, \"18.01A\", null);'>18.01A</a>",
            "offering": "Currently Offered",
            "semester": ["Spring"],
            "in-charge": "Williams, John (Class Admin)",
            "year": "2022",
            "master_subject_id": "1.00",
            "meets_with_subjects": ["1.001"],
            "fall_instructors": ["J. Williams"],
            "spring_instructors": ["J. Williams"],
            "is_variable_units": "N",
            "gir_attribute": "REST",
            "courseNumber": 1,
            "sortDigitNumber": 2,
            "sortCourseNumber": 1,
            "course_eval": "<a target=\"_blank\" href=\"https://edu-apps.mit.edu/ose-rpt/subjectEvaluationSearch.htm?termId=&departmentId=&subjectCode=1.00&instructorName=&search=Search\"> Course Evaluation for 1.00</a>",
            "comm_req_attribute": ["REST"],
            "Instructor": ["J. Williams"]
        },
        {
            "type": "LabSession",
            "label": "B011.00",
            "timeAndPlace": "F9-11 1-390",
            "in-charge": "undefined (Class Admin)",
            "lab-section-of": "1.00"
        },
        {
            "type": "LabSession",
            "label": "B011.001",
            "timeAndPlace": "F9-11 1-390",
            "in-charge": "undefined (Class Admin)",
            "lab-section-of": "1.001"
        }, {
            "type": "Class",
            "id": "1.001",
            "label": "Engineering Computation and Data Science",
            "shortLabel": "Eng Computation & Data Science",
            "level": "Graduate",
            "total-units": 12,
            "units": "3-2-7",
            "course": "1",
            "description": "Presents engineering problems in a computational setting with emphasis on data science and problem abstraction.&nbsp;Covers exploratory data analysis and visualization, filtering, regression. Building basic machine learning models (classifiers, decision trees, clustering) for smart city applications. Labs and programming projects focused on analytics problems faced by cities, infrastructure and environment. Students taking graduate version will complete additional assignments and project work.",
            "prereqs": "<a href='javascript:{}' onclick='showPrereq(this, \"18.01\", null);'>18.01</a> or <a href='javascript:{}' onclick='showPrereq(this, \"18.014\", null);'>18.014</a> or <a href='javascript:{}' onclick='showPrereq(this, \"18.01A\", null);'>18.01A</a>",
            "offering": "Currently Offered",
            "semester": ["Fall", "Spring"],
            "in-charge": "Williams, John (Class Admin)",
            "year": "2022",
            "master_subject_id": "1.00",
            "meets_with_subjects": ["1.00"],
            "fall_instructors": ["J. Williams"],
            "spring_instructors": ["J. Williams"],
            "is_variable_units": "N",
            "courseNumber": 1,
            "sortDigitNumber": 3,
            "sortCourseNumber": 1,
            "sortCourseDecimalNumber": 0.001,
            "course_eval": "<a target=\"_blank\" href=\"https://edu-apps.mit.edu/ose-rpt/subjectEvaluationSearch.htm?termId=&departmentId=&subjectCode=1.00&instructorName=&search=Search\"> Course Evaluation for 1.00</a>",
            "Instructor": ["J. Williams"]
        },
        {
            "type": "LectureSession",
            "label": "L011.001",
            "timeAndPlace": "MW3.30-5 1-390",
            "in-charge": "undefined (Class Admin)",
            "lecture-section-of": "1.001"
        },
        {
            "type": "LectureSession",
            "label": "L011.001",
            "timeAndPlace": "R9.30-10 1-390",
            "in-charge": "undefined (Class Admin)",
            "lecture-section-of": "1.001"
        }
    ]
};

test('Get all courses from JSON', () => {
    const result = getAllCourses(dummyJson);
    expect(result.length).toEqual(1);
    expect(result[0].class.id).toEqual("1.001");
    expect(result[0].lectures.length).toEqual(2);
    expect(result[0].others.length).toEqual(1);
});

test('Parse course', () => {
    const toTest = getAllCourses(dummyJson)[0];
    const result = parseCourse(toTest);
    const expectedClass = dummyJson.items[4];
    expect(result.id).toEqual(`MIT-${expectedClass.id}`);
    expect(result.prof).toEqual(expectedClass.Instructor.join(" "));
    expect(result.name).toEqual(`${expectedClass.id} ${expectedClass.label}`);
    expect(result.school).toEqual("MIT");
    expect(result.semester).toEqual("F");
    expect(result.timeText).toEqual("Mon, Wed 15:30-17:00; Thu 09:30-10:00");
    expect(result.times).toEqual(
        expect.arrayContaining([
            {
                day: 0,
                startHour: "15:30",
                endHour: "17:00"
            },
            {
                day: 2,
                startHour: "15:30",
                endHour: "17:00"
            },
            {
                day: 3,
                startHour: "09:30",
                endHour: "10:00"
            }
        ])
    );
});
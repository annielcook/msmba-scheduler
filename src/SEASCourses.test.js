import {exportedForTesting} from './SEASCourses';
import {currentAcademicSemesters} from './Consts';

const {getCompleteRawCoursesInfo, getRelevantSemestersInfo, parseCourse} = exportedForTesting;

const dummyCourseList = [
    {
        "area": "ACS",
        "courseNumber": "AC 207",
        "title": "Systems Development for Computational Science",
        "semesters": [
            {
                "academicYear": 2023,
                "term": "Spring",
                "instructors": [{"firstName": "Fabian", "lastName": "Wermelinger"}],
                "offeredStatus": "Yes"
            },
            {
                "academicYear": 2022,
                "term": "Spring",
                "instructors": [],
                "offeredStatus": ""
            },
            {
                "academicYear": 2024,
                "term": "Fall",
                "instructors": [],
                "offeredStatus": ""
            }],
        "prefix": "AC",
        "id": null
    },
    {
        "area": "ACS",
        "courseNumber": "AC 209a",
        "title": "Data Science 1: Introduction to Data Science",
        "semesters": [
            {
                "academicYear": 2022,
                "term": "Fall",
                "instructors": [{"lastName": "Protopapas", "firstName": "Pavlos"}],
                "offeredStatus": "Yes"
            },
            {
                "academicYear": 2024,
                "term": "Fall",
                "instructors": [],
                "offeredStatus": ""
            }],
        "prefix": "AC",
        "id": null
    }
];
const dummyCourseTimes = [
    {
        "_id": "5eda9456a226a54703503873",
        "area": "ACS",
        "courseNumber": "AC 207",
        "isUndergraduate": false,
        "semesters": [
            {
                "academicYear": 2020,
                "term": "Fall",
                "times": [{"days": "TR", "startTime": 720, "endTime": 795, "_id": "5f29c8e6f6dc37942e4896d1"}]
            },
            {
                "academicYear": 2021,
                "term": "Fall",
                "times": [{"days": "TR", "startTime": 765, "endTime": 840, "_id": "610acc2b64b4c5f30df44f90"}]
            },
            {
                "academicYear": 2023,
                "term": "Spring",
                "times": [{"days": "TR", "startTime": 855, "endTime": 930, "_id": "62d167c0d131374671a25d0a"}]
            }
        ],
        "prefix": "AC",
        "id": "5eda9456a226a54703503873"
    },
    {
        "_id": "570cf330e3826cab6f6d94f4",
        "area": "ACS",
        "courseNumber": "AC 209a",
        "isUndergraduate": false,
        "semesters": [{
            "academicYear": 2016,
            "term": "Fall",
            "times": [{"days": "MW", "startTime": 780, "endTime": 870, "_id": "5751c832cf1d903e2cc7ec22"}]
        }, {
            "academicYear": 2017,
            "term": "Fall",
            "times": [{"days": "MW", "startTime": 780, "endTime": 870, "_id": "58caa9abfa0b7c205c4f8b5f"}]
        }, {
            "academicYear": 2018,
            "term": "Fall",
            "times": [{"days": "MW", "startTime": 810, "endTime": 885, "_id": "5ab42b331b3c83287a79646b"}]
        }, {
            "academicYear": 2019,
            "term": "Fall",
            "times": [{"days": "MW", "startTime": 810, "endTime": 885, "_id": "5c8298dba54e871c101275a0"}]
        }, {
            "academicYear": 2020,
            "term": "Fall",
            "times": [{
                "days": "MWF",
                "startTime": 540,
                "endTime": 615,
                "_id": "5f40250fed7b833f52f2128e"
            }, {"days": "MWF", "startTime": 900, "endTime": 975, "_id": "5f40250fed7b833f52f2128d"}]
        }, {
            "academicYear": 2021,
            "term": "Fall",
            "times": [{"days": "MWF", "startTime": 585, "endTime": 660, "_id": "610afe01457c4cc70a92ef8e"}]
        }, {
            "academicYear": 2022,
            "term": "Fall",
            "times": [{"days": "MWF", "startTime": 585, "endTime": 660, "_id": "62d16f15e4da944571e2b202"}]
        }],
        "prefix": "AC",
        "id": "570cf330e3826cab6f6d94f4"
    }
];

test('Get full course info', async () => {
    const result = getCompleteRawCoursesInfo(dummyCourseList, dummyCourseTimes);

    const columns = Object.keys(result[0]);
    expect(columns).toEqual(
        expect.arrayContaining(["area", "courseNumber", "title", "semesters",
            "prefix", "id", "semesterTimes", "isUndergraduate"])
    );
});

test('Get course semesters info', () => {
    const toTest = getCompleteRawCoursesInfo(dummyCourseList, dummyCourseTimes);
    const resultOfferedSpring = getRelevantSemestersInfo(toTest[0]);
    const resultOfferedFall = getRelevantSemestersInfo(toTest[1]);

    expect(resultOfferedSpring.length).toEqual(1);
    expect(resultOfferedFall.length).toEqual(1);

    expect(resultOfferedSpring[0].year).toEqual(currentAcademicSemesters[1].year);
    expect(resultOfferedSpring[0].term).toEqual(currentAcademicSemesters[1].term);
    expect(resultOfferedFall[0].year).toEqual(currentAcademicSemesters[0].year);
    expect(resultOfferedFall[0].term).toEqual(currentAcademicSemesters[0].term);

    expect(resultOfferedSpring[0].instructors).toEqual(
        expect.arrayContaining(dummyCourseList[0].semesters[0].instructors)
    );
    expect(resultOfferedSpring[0].times).toEqual(
        expect.arrayContaining(dummyCourseTimes[0].semesters[2].times)
    );

    expect(resultOfferedFall[0].instructors).toEqual(
        expect.arrayContaining(dummyCourseList[1].semesters[0].instructors)
    );
    expect(resultOfferedFall[0].times).toEqual(
        expect.arrayContaining(dummyCourseTimes[1].semesters[6].times)
    );
});

test('Parse course', () => {
    const toTest = getCompleteRawCoursesInfo(dummyCourseList, dummyCourseTimes);
    const resultSpring = parseCourse(toTest[0]);
    expect(resultSpring.length).toEqual(1);
    const resultSpringInfo = resultSpring[0];
    expect(resultSpringInfo.semester).toEqual("S");
    expect(resultSpringInfo.school).toEqual("SEAS");
    expect(resultSpringInfo.prof).toEqual("Fabian Wermelinger");
    expect(resultSpringInfo.name).toEqual(`${dummyCourseList[0].courseNumber} ${dummyCourseList[0].title}`);
    expect(resultSpringInfo.id).toEqual(`SEAS-Spring-${dummyCourseTimes[0].courseNumber.replace(' ', '-')}`);
    expect(resultSpringInfo.times).toEqual(
        expect.arrayContaining([
            {
                day: 1,
                startHour: "14:15",
                endHour: "15:30"
            },
            {
                day: 3,
                startHour: "14:15",
                endHour: "15:30"
            }
        ])
    )
    expect(resultSpringInfo.timeText).toEqual("Tue, Thu 14:15-15:30");
});
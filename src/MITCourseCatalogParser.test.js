import {parseCourse} from "./MITCourseCatalogParser";


const dummyJson = [
    {
        "name": "18.01 Calculus",
        "school": "MIT",
        "prof": "L. Guth",
        "semester": "F",
        "times": "TR1,F2"
    },
    {
        "name": "18.01A Calculus",
        "school": "MIT",
        "prof": "D. Jerison",
        "semester": "F",
        "times": "TR1,F2"
    },
    {
        "name": "18.02 Calculus",
        "school": "MIT",
        "prof": "J. Hahn",
        "semester": "F",
        "times": "TR1,F2"
    },
    {
        "name": "6.5830 Database Systems\n(6.830)",
        "school": "MIT",
        "prof": "S. R. Madden",
        "semester": "F",
        "times": "MW2.30-4"
    },
    {
        "name": "6.5831 Database Systems\n(6.814)",
        "school": "MIT",
        "prof": "S. Madden",
        "semester": "F",
        "times": "MW2.30-4"
    },
    {
        "name": "6.1900 Introduction to Low-level Programming in C and Assembly\n(6.0004)",
        "school": "MIT",
        "prof": "J. Steinmeyer",
        "semester": "F",
        "times": "M12.30-2"
    }
];

test('Parse catalog course', () => {
    const result = parseCourse(dummyJson[0]);
    expect(result.id).toEqual(`MIT-18.01`);
    expect(result.prof).toEqual(dummyJson[0].prof);
    expect(result.name).toEqual(dummyJson[0].name);
    expect(result.school).toEqual("MIT");
    expect(result.semester).toEqual(dummyJson[0].semester);
    expect(result.timeText).toEqual("Tue, Thu 13:00-14:00; Fri 14:00-15:00");
    expect(result.times).toEqual(
        expect.arrayContaining([
            {
                day: 1,
                startHour: "13:00",
                endHour: "14:00"
            },
            {
                day: 3,
                startHour: "13:00",
                endHour: "14:00"
            },
            {
                day: 4,
                startHour: "14:00",
                endHour: "15:00"
            }
        ])
    );
});
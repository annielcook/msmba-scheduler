import {exportedForTesting} from './HBSCourses';
import path from 'path';
import fs from "fs";

const {readCSV, parseCourse} = exportedForTesting;

test('Reads HBS csv', async () => {
    const filePath = path.join(__dirname, 'static', 'courses', 'HBS-2022.csv');
    const csvFile = fs.readFileSync(filePath);
    const csvData = csvFile.toString();
    const result = await readCSV(csvData);
    expect(result.length).toBe(193);
    const columns = Object.keys(result[0]);
    expect(columns).toEqual(
        expect.arrayContaining(["SectionID", "Term", "Title", "Faculty", "Day", "Start",
            "OtherEventsDay", "OtherEventsStart", "LongCourseTitle"])
    );
});

test('Parse course data', () => {
    const dummyData = [
        {
            SectionID: 123,
            Term: "Spring",
            Title: "Arts of Communication Q4, 1.5",
            Faculty: "Candace Bertotti",
            Day: "Y",
            Start: "3: 10 PM",
            OtherEventsDay: "",
            OtherEventsStart: "",
            LongCourseTitle: "The Arts of Communication"
        },
        {
            SectionID: 456,
            Term: "Fall",
            Title: "Authntic Leader Develp Q1Q2, 3",
            Faculty: "Thomas DeLong",
            Day: "T",
            Start: "8: 30 AM",
            OtherEventsDay: "T",
            OtherEventsStart: "5: 30 PM",
            LongCourseTitle: "Authentic Leader Development"
        }

    ];
    const parsedNoOtherEvents = parseCourse(dummyData[0]);
    const parsedWithOtherEvents = parseCourse(dummyData[1]);

    expect(parsedNoOtherEvents.semester).toBe("S");
    expect(parsedNoOtherEvents.id).toBe("HBS-123");
    expect(parsedNoOtherEvents.name).toBe(dummyData[0].LongCourseTitle);
    expect(parsedNoOtherEvents.prof).toBe(dummyData[0].Faculty);
    expect(parsedNoOtherEvents.school).toBe("HBS");
    expect(parsedNoOtherEvents.timeText).toBe("Thu, Fri 15:10-16:30");
    expect(parsedNoOtherEvents.times[0].day).toBe(3);
    expect(parsedNoOtherEvents.times[0].startHour).toBe("15:10");
    expect(parsedNoOtherEvents.times[0].endHour).toBe("16:30");
    expect(parsedNoOtherEvents.times[1].day).toBe(4);
    expect(parsedNoOtherEvents.times[1].startHour).toBe("15:10");
    expect(parsedNoOtherEvents.times[1].endHour).toBe("16:30");

    expect(parsedWithOtherEvents.semester).toBe("F");
    expect(parsedWithOtherEvents.id).toBe("HBS-456");
    expect(parsedWithOtherEvents.name).toBe(dummyData[1].LongCourseTitle);
    expect(parsedWithOtherEvents.prof).toBe(dummyData[1].Faculty);
    expect(parsedWithOtherEvents.school).toBe("HBS");
    expect(parsedWithOtherEvents.timeText).toBe("Tue 08:30-09:50; Tue 17:30-18:50");
    expect(parsedWithOtherEvents.times[0].day).toBe(1);
    expect(parsedWithOtherEvents.times[0].startHour).toBe("08:30");
    expect(parsedWithOtherEvents.times[0].endHour).toBe("09:50");
    expect(parsedWithOtherEvents.times[1].day).toBe(1);
    expect(parsedWithOtherEvents.times[1].startHour).toBe("17:30");
    expect(parsedWithOtherEvents.times[1].endHour).toBe("18:50");
});
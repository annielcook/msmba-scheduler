import json
import os
import argparse

HEADER = "SectionID,Term,Title,Faculty,Day,Start,OtherEventsDay,OtherEventsStart,LongCourseTitle"

def getTime(timeList):
    match timeList:
        case [8, 30, 0, 0]:
            return "8:30 AM"
        case [10, 10, 0, 0]:
            return "10:10 AM"
        case [11, 50, 0, 0]:
            return "11:50 AM"
        case [13, 30, 0, 0]:
            return "1:30 PM"
        case [15, 10, 0, 0]:
            return "3:10 PM"
        case [15, 50, 0, 0]:
            return "3:50 PM"
        case [17, 30, 0, 0]:
            return "5:30 PM"
        case [16, 30, 0, 0]:
            return "4:30 PM"
        case [16, 0, 0, 0]:
            return "4:00 PM"
        case _:
            import pdb; pdb.set_trace()
    

def getFaculty(facultyMembers):
    facultyList = [faculty["firstName"] + " " + faculty["lastName"] for faculty in facultyMembers]
    return " & ".join(facultyList)


def parse_section(section):
    sectionId = section["course"]["id"]
    term = section["term"]["name"]
    title = section["course"]["shortName"]
    faculty = getFaculty(section["facultyMembers"])
    day = section["scheduleType"]
    if section["primaryEvent"]==None:
        return
    start = getTime(section["primaryEvent"]["startTime"])
    otherEventsDay = ""
    otherEventsStart = ""
    longTitle = section["course"]["longName"]
    
    return f"{sectionId},{term},{title},{faculty},{day},{start},{otherEventsDay},{otherEventsStart},{longTitle}\n"

def parse_course(course):
    return course["shortName"] + "\n"

def parse_courses(output_file):
    
    with open(os.path.join('data_scripts/HBS-test.json'), 'r') as f:
        data = json.load(f)

        with open(os.path.join(output_file), "w+") as output:
            output.write(HEADER)

            for section in data["sections"]:
                section_details = parse_section(section)
                if section_details is None: continue
                output.write(section_details)
            for course in data["courses"]:
                course_details = parse_course(course)
                output.write(course_details)



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Parse HBS courses JSON")
    parser.add_argument('-o', '--output-file', required=True)

    args = parser.parse_args()

    parse_courses(args.output_file)
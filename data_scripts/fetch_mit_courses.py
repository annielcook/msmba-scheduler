import argparse
import json
import os

import requests
from bs4 import BeautifulSoup

PAGES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
BASIC_COURSE_URL = lambda course, page: f'http://student.mit.edu/catalog/m{course}{PAGES[page]}.html'


def get_course_pages(course_number):
    page_url = BASIC_COURSE_URL(course_number, 0)
    html_text = requests.get(page_url).text
    soup = BeautifulSoup(html_text, 'html.parser')
    index_div = soup.find(id="contentmini")
    count = len([e for e in index_div.find_all('b') if e.text.strip().startswith(str(course_number))])
    return [BASIC_COURSE_URL(course_number, i) for i in range(count)]


def create_course_dict(course_title, course_times, semester, professor):
    return {"name": course_title,
            "school": "MIT",
            "prof": professor,
            "semester": semester,
            "times": course_times}


def get_courses_from_page(page_url):
    html_text = requests.get(page_url).text
    soup = BeautifulSoup(html_text, 'html.parser')
    semester = "F" if soup.find('h1').next.next.next.text.startswith("Fall") else "S"
    courses = []
    for title in soup.find_all('h3'):
        n = title.next
        while n is not None and n.text != "Lecture:" and n.name != 'h3':
            n = n.next
        if n is None or n.name == 'h3':
            continue

        course_time_element = n.next_sibling.next_sibling
        n = course_time_element.next
        description = False
        while not description or n.name != 'i':
            if n.name == 'img' and n.attrs['alt'] == '______':
                description = True
            n = n.next
            if n.name == 'i' and description:
                break
        if n.previous.text == 'Fall: ' and semester == 'S':
            course_prof = n.next_sibling.next_sibling.next_sibling.text
        else:
            course_prof = n.text
        course_title = title.text.strip()
        course_time = course_time_element.text
        courses.append(create_course_dict(course_title, course_time, semester, course_prof))
    return courses


def download_courses(course_numbers, download_directory):
    for course_number in course_numbers:
        courses = []
        for page in get_course_pages(course_number):
            courses += get_courses_from_page(page)
        with open(os.path.join(download_directory, f'MIT-{course_number}.json'), 'w') as f:
            f.write(json.dumps(courses))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download MIT courses JSON")
    parser.add_argument('-o', '--output-dir', required=True)
    parser.add_argument('-c', '--courses', nargs='+', required=True)

    args = parser.parse_args()

    download_courses(args.courses, args.output_dir)

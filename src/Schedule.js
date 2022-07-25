import './App.css';
import Calendar from './Calendar'
import Grid from '@mui/material/Grid';
import CourseList from './CourseList'
import * as React from "react";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import {parseCourses} from "./HBSCourses"
import Paper from "@mui/material/Paper";
import {hbsCoursesFile, seasCoursesListFile, seasCoursesScheduleFile} from "./Consts";
import {getSEASCoursesFromJsons} from "./SEASCourses";
import {loadFile} from "./IO";


const hbsCoursesCsv = loadFile(hbsCoursesFile);
const seasCoursesListJson = seasCoursesListFile;
const seasCoursesScheduleJson = seasCoursesScheduleFile;


function Schedule() {
    const [favorites, setFavorites] = React.useState([]);
    const [show, setShow] = React.useState([]);
    const [allCourses, updateAllCourses] = React.useState({});

    React.useEffect(() => {
        const getAllCourses = async () => {
            const hbsCourses = await parseCourses(hbsCoursesCsv);
            const seasCourses = await getSEASCoursesFromJsons(seasCoursesListJson, seasCoursesScheduleJson);
            let coursesMap = {};
            for (const course of hbsCourses) {
                coursesMap[course.id] = course;
            }
            for (const course of seasCourses) {
                coursesMap[course.id] = course;
            }
            updateAllCourses(coursesMap);
        }
        getAllCourses();
    }, []);

    const coursePicker = (
        <CourseList items={Object.values(allCourses)}
                    checked={favorites}
                    toggleCallback={(course) => () => {
                        const newFavorites = [...favorites];
                        const newShow = [...show];
                        const currentIndexFavs = favorites.indexOf(course.id);

                        if (currentIndexFavs === -1) {
                            newFavorites.push(course.id);
                            newFavorites.sort();
                        } else {
                            newFavorites.splice(currentIndexFavs, 1);
                            const currentIndexShow = show.indexOf(course.id);
                            if (currentIndexShow !== -1) {
                                newShow.splice(currentIndexShow, 1);
                            }
                        }
                        setFavorites(newFavorites);
                        setShow(newShow);
                    }}
                    selectIcon={<FavoriteBorder/>}
                    selectCheckedIcon={<Favorite/>}
        />);

    const chosenCourses = (
        <CourseList checked={show}
                    items={favorites.map((courseId) => allCourses[courseId])}
                    toggleCallback={(course) => () => {
                        const newShow = [...show];
                        const currentIndex = show.indexOf(course.id);
                        if (currentIndex === -1) {
                            newShow.unshift(course.id);
                            newShow.sort();
                        } else {
                            newShow.splice(currentIndex, 1);
                        }
                        setShow(newShow);
                    }}
                    useSwitch
        />);

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <p>All Courses</p>
                <Paper style={{maxHeight: "100vh", overflow: 'auto'}}>
                    {coursePicker}
                </Paper>
            </Grid>
            <Grid item xs={3}>
                <p>Favorites</p>
                <Paper style={{maxHeight: "100vh", overflow: 'auto'}}>
                    {chosenCourses}
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Calendar courses={show.map((courseId) => allCourses[courseId])}/>
            </Grid>
        </Grid>
    );
}

export default Schedule;

import './App.css';
import Calendar from './Calendar'
import Grid from '@mui/material/Grid';
import CourseList from './CourseList'
import * as React from "react";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import {parseCourses} from "./HBSCourses"
import Paper from "@mui/material/Paper";
import {seasCoursesListJson, seasCoursesScheduleJson, requiredCoursesJson} from "./Consts";
import {getSEASCoursesFromJsons} from "./SEASCourses";
import {HBSCoursesCsv} from './static/courses/HBS-2022'; // TODO: fix load of original CSV file
import { useCookies } from 'react-cookie';


function Schedule() {
    const [cookies, setCookie] = useCookies(['user']);
    const [favorites, setFavorites] = React.useState(Object.keys(cookies).length === 0 ? [] : cookies.Favorites);
    const [show, setShow] = React.useState(Object.keys(cookies).length === 0 ? [] : cookies.Show);
    const [allCourses, updateAllCourses] = React.useState({});


    React.useEffect(() => {
        const getAllCourses = async () => {
            const hbsCourses = await parseCourses(HBSCoursesCsv);
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

    if (Object.keys(allCourses).length === 0) {
        return <p>Loading...</p>;
    }

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
                        setCookie('Favorites', newFavorites, { path: '/' });
                        setCookie('Show', newShow, { path: '/' });
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
                        setCookie('Show', newShow, { path: '/' });
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
                <Calendar courses={show.map((courseId) => allCourses[courseId]).concat(requiredCoursesJson)}/>
            </Grid>
        </Grid>
    );
}

export default Schedule;

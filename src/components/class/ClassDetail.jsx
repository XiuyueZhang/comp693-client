import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, useTheme, useMediaQuery, CardContent, CardMedia, Card } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Alert from '@mui/material/Alert';

import UserProfile from '../users/UserProfile';
import LoadingBody from '../widgets/LoadingBody';
import { setSelectedClass, addEnrolledClaases, setIsSelectedClassEnrolled, setEnrolledClaases, setErrorMessage, setSuccessMessage } from '../../store';
import { getSelectedClassInfoRequest, userEnrollClassRequest, userRemoveClassRequest } from '../../api/requests';


function ClassDetail(props) {
    const theme = useTheme();
    const isWideScreens = useMediaQuery("(min-width: 1600px)");
    const isScreenWidthMothThan1000 = useMediaQuery("(min-width: 1400px)");
    const selectedClass = useSelector((state) => state.classes.selectedClass);
    const enrolledClassList = useSelector(state => state.classes.enrolledClaases);
    const isSelectedClassEnrolled = useSelector(state => state.classes.isSelectedClassEnrolled);
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const { classId } = useParams();
    const navigate = useNavigate();
    const errorMessage = useSelector(state => state.settings.errorMessage);
    const successMessage = useSelector(state => state.settings.successMessage);
    const [show, setShow] = useState(false);

    // On componentDidMount set the timer
    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setShow(false)
            setErrorMessage("")
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }
    }, [show]);

    const enrolClassHandler = async () => {
        if (user) {
            try {
                // ENROL CLASS
                const response = await userEnrollClassRequest(user.id, classId, token, "user");

                // Check if the HTTP request was successful
                if (!response.error) {
                    // Successfully added enrolment
                    dispatch(setErrorMessage({
                        errorMessage: ""
                    }))
                    // Add this class to enrolledClasses
                    dispatch(addEnrolledClaases({
                        newEnrolledClasses: selectedClass
                    }))
                    // Display or use the successMessage here
                    const successMessage = "Successfully added enrolment";
                    dispatch(setSuccessMessage({
                        successMessage: successMessage
                    }))
                    setShow(true)
                } else {
                    const errorMessage = "Error adding enrollment: " + response.error;
                    dispatch(setErrorMessage({
                        errorMessage: errorMessage
                    }))
                    dispatch(setSuccessMessage({
                        successMessage: ""
                    }))
                    setShow(true)
                }
            } catch (error) {
                const errorMessage = "Error adding enrollment: " + error.message;
                dispatch(setErrorMessage({
                    errorMessage: errorMessage
                }))
                dispatch(setSuccessMessage({
                    successMessage: ""
                }))
                setShow(true)
            }
        } else {
            // NON USER - Navigate to login page
            navigate("/login");
        }
    };

    const removeClassHandler = async (classIdToRemove) => {
        if (user) {
            try {
                // DELETE ENROLLED CLASS
                const response = await userRemoveClassRequest(user.id, classIdToRemove, token, "user");
                // Check if the HTTP request was successful
                if (!response.error) {
                    // Successfully deleted enrolment
                    const successMessage = "Successfully deleted enrolment";
                    dispatch(setErrorMessage({
                        errorMessage: ""
                    }))
                    dispatch(setSuccessMessage({
                        successMessage: successMessage
                    }))
                    // Filter the enrolledClassesList
                    const updatedEnrolledClassList = enrolledClassList.filter(item => item._id !== classIdToRemove);
                    dispatch(setEnrolledClaases({
                        enrolledClasses: updatedEnrolledClassList
                    }))
                    setShow(true)
                } else {
                    const errorMessage = "Error deleting enrollment: Status " + response.error;
                    dispatch(setErrorMessage({
                        errorMessage: errorMessage
                    }))
                    dispatch(setSuccessMessage({
                        successMessage: ""
                    }))
                    setShow(true)
                }
            } catch (error) {
                const errorMessage = "Error deleting enrollment: " + error.message;
                dispatch(setErrorMessage({
                    errorMessage: errorMessage
                }))
                dispatch(setSuccessMessage({
                    successMessage: ""
                }))
                setShow(true);
            }
        }
    }

    const editClassHandler = () => {
        // ADMIN USER
        navigate(`/admin/class/update/${classId}`)
    }


    // fetch the selected class data when first render
    useEffect(() => {
        const fetchClassDetailData = async () => {
            // Fetch the homepage content
            const response = await getSelectedClassInfoRequest(classId);

            // Check if the HTTP request was successful
            if (!response.error) {
                dispatch(setSelectedClass({
                    selectedClass: response.data
                }));
            } else {
                // reponse.error is not null
            }
        };
        fetchClassDetailData(); // Call the fetchData function when the component mounts
    }, [classId, dispatch, isSelectedClassEnrolled, user]);

    useEffect(() => {
        if (enrolledClassList.length !== 0) {
            const isSelectedClassEnrolled = enrolledClassList.some(item => item._id === selectedClass._id);
            dispatch(setIsSelectedClassEnrolled({
                isSelectedClassEnrolled: isSelectedClassEnrolled
            }));
        } else {
            dispatch(setIsSelectedClassEnrolled({
                isSelectedClassEnrolled: false
            }));
        }
    }, [enrolledClassList, selectedClass, dispatch]);


    if (!selectedClass) {
        // If selectedClass is null (still loading), show loading page
        return <LoadingBody />;
    }

    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 3%"
                textAlign="center"
            >
            </Box>

            {isWideScreens ? (
                // DESKTOP SCREENS MORE THAN 1600PX VIEW
                <Box
                    width="80%"
                    p="2rem"
                    m="2rem auto"
                    borderRadius="1.5rem"
                    backgroundColor={theme.palette.background.alt}

                >

                    <Box
                        display="flex"
                        justifyContent={user ? "space-around" : "center"}
                        alignItems="space-arouond"
                        flexWrap="wrap"
                    >
                        <Card sx={{
                            display: 'flex', width: "60%",
                        }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }} onClick={() => navigate("/")}>
                                    <IconButton sx={{ marginLeft: "1.1rem" }}>
                                        <ArrowBackIosIcon />
                                    </IconButton>
                                    <Typography variant="subtitle1" color="text.secondary" component="div"
                                        sx={{ margin: "1.1rem" }}>
                                        Back to class List
                                    </Typography>
                                </Box>

                                {show && (
                                    <Box width="60%" display="flex" justifyContent="center" alignItems="center">
                                        {errorMessage && (
                                            <Alert severity="error" sx={{ width: '100%', textAlign: 'center' }}>
                                                {errorMessage}
                                            </Alert>
                                        )}
                                        {successMessage && (
                                            <Alert severity="success" sx={{ width: '100%', textAlign: 'center' }}>
                                                {successMessage}
                                            </Alert>
                                        )}
                                    </Box>
                                )}

                                <CardMedia
                                    component="video"
                                    { ...(user && { controls: true }) }
                                    sx={{ width: "93%", margin: "1rem" }}
                                    src={selectedClass.videoPath}
                                    alt="Class 01 info"
                                />
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography
                                        component="div"
                                        variant="h5"
                                        sx={{
                                            width: "400px",
                                            wordWrap: "break-word",
                                            color: "primary",
                                            fontWeight: 550
                                        }}>
                                        {selectedClass.title}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                        Level: {selectedClass.level}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                        Cloud: {selectedClass.category}
                                    </Typography>
                                </CardContent>
                                <Box m="0.7rem" alignSelf="flex-end" mr="5rem" mb="5rem">
                                    {user ? (
                                        user.role === "user" ? (
                                            isSelectedClassEnrolled ? (
                                                <Button variant="contained" onClick={() => removeClassHandler(classId)}>REMOVE</Button>
                                            ) : (
                                                <Button variant="contained" onClick={enrolClassHandler}>ENROLL</Button>
                                            )
                                        ) : (
                                            user.role === "admin" && (
                                                <Button variant="contained" onClick={editClassHandler}>EDIT</Button>
                                            )
                                        )
                                    ) : (
                                        <Button variant="contained" onClick={enrolClassHandler}>ENROLL</Button>
                                    )}
                                </Box>
                            </Box>
                            <Box width="50%"
                                mr="1rem"
                            >
                                <Typography variant="subtitle1" color="text.primary" component="div" sx={{ marginTop: "5rem" }}>
                                    Description:
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                    {selectedClass.description}
                                </Typography>
                            </Box>
                        </Card>
                        <Box>
                            <Card>
                                {user ? (user.role ? (<UserProfile removeClassHandler={removeClassHandler} />) : (null)
                                ) : null}
                            </Card>
                        </Box>
                    </Box>
                </Box>

            ) : (
                isScreenWidthMothThan1000 ? (
                    // SCREENS 1300PX ~ 1600PX
                    <Box
                        width="80%"
                        p="2rem"
                        m="2rem auto"
                        borderRadius="1.5rem"
                        backgroundColor={theme.palette.background.alt}

                    >

                        <Box
                            display="flex"
                            justifyContent={user ? "space-around" : "center"}
                            alignItems="space-arouond"
                            flexWrap="wrap"
                        >
                            <Card sx={{
                                display: 'flex', width: "60%",
                                pr: "1rem",
                                "&:hover": {
                                    cursor: "pointer",
                                },
                            }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: "wrap", width: "99%", alignItems: "center" }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: "99%", flexWrap: "wrap" }} onClick={() => navigate("/")}>
                                        <IconButton sx={{ marginLeft: "1.1rem" }}>
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                        <Typography variant="subtitle1" color="text.secondary" component="div"
                                            sx={{ margin: "1.1rem" }}
                                            >
                                            Back to class List
                                        </Typography>
                                    </Box>

                                    {show && (
                                        <Box width="60%" display="flex" justifyContent="center" alignItems="center">
                                            {errorMessage && (
                                                <Alert severity="error" sx={{ width: '100%', textAlign: 'center' }}>
                                                    {errorMessage}
                                                </Alert>
                                            )}
                                            {successMessage && (
                                                <Alert severity="success" sx={{ width: '100%', textAlign: 'center' }}>
                                                    {successMessage}
                                                </Alert>
                                            )}
                                        </Box>
                                    )}

                                    <CardMedia
                                        component="video"
                                        { ...(user && { controls: true }) }
                                        // autoPlay 
                                        sx={{ width: "93%", margin: "1rem" }}
                                        src={selectedClass.videoPath}
                                        alt="Class 01 info"
                                    />
                                    <CardContent sx={{ flex: '1 0 auto', width: "95%", flexWrap: "wrap" }}>
                                        <Typography
                                            component="div"
                                            variant="h5"
                                            sx={{
                                                width: "400px",
                                                wordWrap: "break-word",
                                                color: "primary",
                                            }}>
                                            {selectedClass.title}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Level: {selectedClass.level}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Cloud: {selectedClass.category}
                                        </Typography>
                                    </CardContent>
                                    <Box width="90%"
                                        sx={{ display: 'flex', justifyContent: 'flex-end', pl: 1, pb: 1 }}>
                                        <Box m="0.7rem">
                                            {user ? (
                                                user.role === "user" ? (
                                                    isSelectedClassEnrolled ? (
                                                        <Button variant="contained" onClick={() => removeClassHandler(classId)}>REMOVE</Button>
                                                    ) : (
                                                        <Button variant="contained" onClick={enrolClassHandler}>ENROLL</Button>
                                                    )
                                                ) : (
                                                    user.role === "admin" && (
                                                        <Button variant="contained" onClick={editClassHandler}>EDIT</Button>
                                                    )
                                                )
                                            ) : (
                                                <Button variant="contained" onClick={enrolClassHandler}>ENROLL</Button>
                                            )}
                                        </Box>

                                    </Box>
                                    <Box
                                        m="1rem"
                                        maxWidth="800px"
                                        width="90%"
                                    >
                                        <Typography variant="subtitle1" color="text.primary" component="div">
                                            Description:
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            {selectedClass.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Box>
                    </Box>
                ) : (
                    // SCREENS UNDER 1300PX
                    <Box
                        p="1rem"
                        m="1rem auto"
                        borderRadius="1.5rem"
                        backgroundColor={theme.palette.background.alt}
                        width="100%"
                        display="flex"
                        justifyContent="center"
                        minWidth="350px"
                    >

                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexWrap="wrap"
                            width="100%"
                        >
                            <Card sx={{
                                width: "99%",
                                display: 'flex',
                                justifyContent: "center",
                                "&:hover": {
                                    cursor: "pointer",
                                },
                            }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: "wrap", width: "99%", alignItems: "center" }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: "99%", flexWrap: "wrap" }} onClick={() => navigate("/")}>
                                        <IconButton sx={{ marginLeft: "1.1rem" }}>
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                        <Typography variant="subtitle1" color="text.secondary" component="div"
                                            sx={{ margin: "1.1rem" }}
                                            >
                                            Back to class List
                                        </Typography>
                                    </Box>

                                    {show && (
                                        <Box width="60%" display="flex" justifyContent="center" alignItems="center">
                                            {errorMessage && (
                                                <Alert severity="error" sx={{ width: '100%', textAlign: 'center' }}>
                                                    {errorMessage}
                                                </Alert>
                                            )}
                                            {successMessage && (
                                                <Alert severity="success" sx={{ width: '100%', textAlign: 'center' }}>
                                                    {successMessage}
                                                </Alert>
                                            )}
                                        </Box>
                                    )}
                                    <CardMedia
                                        component="video"
                                        { ...(user !== null && { controls: true }) }
                                        // autoPlay 
                                        sx={{ width: "93%", margin: "1rem" }}
                                        src={selectedClass.videoPath}
                                        alt="Class 01 info"
                                    />
                                    <CardContent sx={{ flex: '1 0 auto', width: "95%", flexWrap: "wrap" }}>
                                        <Typography
                                            component="div"
                                            variant="h5"
                                            sx={{
                                                width: "400px",
                                                wordWrap: "break-word",
                                                color: "primary",
                                            }}>
                                            {selectedClass.title}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Level: {selectedClass.level}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Cloud: {selectedClass.category}
                                        </Typography>
                                    </CardContent>
                                    <Box width="90%"
                                        sx={{ display: 'flex', justifyContent: 'flex-end', pl: 1, pb: 1 }}>
                                        <Box m="0.7rem">
                                            {user ? (
                                                user.role === "user" ? (
                                                    isSelectedClassEnrolled ? (
                                                        <Button variant="contained" onClick={() => removeClassHandler(classId)}>REMOVE</Button>
                                                    ) : (
                                                        <Button variant="contained" onClick={enrolClassHandler}>ENROLL</Button>
                                                    )
                                                ) : (
                                                    user.role === "admin" && (
                                                        <Button variant="contained" onClick={editClassHandler}>EDIT</Button>
                                                    )
                                                )
                                            ) : (
                                                <Button variant="contained" onClick={enrolClassHandler}>ENROLL</Button>
                                            )}
                                        </Box>
                                    </Box>
                                    <Box
                                        m="1rem"
                                        maxWidth="800px"
                                        width="90%"
                                    >
                                        <Typography variant="subtitle1" color="text.primary" component="div">
                                            Description:
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            {selectedClass.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Box>
                    </Box>
                )


            )}


        </Box>
    );
};

export default ClassDetail;
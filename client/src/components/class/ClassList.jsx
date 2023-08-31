import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { getHomepageContentRequest } from '../../api/requests';
import { setClassList } from '../../store';
import MultipleSelect from '../widgets/MultipleSelect';
import ClassItem from './ClassItem';

function ClassList(props) {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 600px)");
    let classList = useSelector((state) => state.classes.allClasses);
    const filteredclassList = useSelector((state) => state.classes.filteredClasses);
    const dispatch = useDispatch();

    // fetch all class data when first render
    useEffect(() => {
        const fetchAllClassData = async () => {
            // Fetch the homepage content
            const response = await getHomepageContentRequest();

            // Check if the HTTP request was successful
            if (!response.error) {
                dispatch(setClassList({
                    allClasses: response.data
                }));
            } else {
                // response.error is not null
            }
        };

        fetchAllClassData(); // Call the fetchData function when the component mounts
    }, [dispatch]);



    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 3%"
                textAlign="center"
            >
            </Box>

            <Box
                width={isNonMobileScreens ? "90%" : "60%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
                minWidth="350px"
            >
                <Box >
                    <MultipleSelect />
                </Box>
                <Box
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                    flexWrap="wrap"
                >

                    {filteredclassList.length === 0 ? (
                        classList.map((classItem) => (
                            <Box key={classItem._id} sx={{ minWidth: "350px" }}>
                                <ClassItem classItem={classItem} />
                            </Box>
                        ))
                    ) : (
                        filteredclassList.map((classItem) => (
                            <Box key={classItem._id} sx={{ minWidth: "350px" }}>
                                <ClassItem classItem={classItem} />
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ClassList;
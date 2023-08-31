import * as React from 'react';
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box, CardMedia } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from "react-redux";
import { setEnrolledClaases } from '../../store';
import StarIcon from '@mui/icons-material/Star';
import { getEnrolledClassInfoRequest } from '../../api/requests';
import EnrolledClassItem from './EnrolledClassItem';

export default function UserProfile(props) {

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const enrolledClassList = useSelector(state => state.classes.enrolledClaases);
    const dispatch = useDispatch();
    const imageRootPath = `${process.env.PUBLIC_URL}/images/`;
    const { removeClassHandler } = props

    useEffect(() => {

        // get enrolled classes, and set into redux
        const enrolledClassedList = async () => {
            if (user.role === "user") {
                const response = await getEnrolledClassInfoRequest(user.id, token, "user");
                if (!response.error) {
                    dispatch(setEnrolledClaases({
                        enrolledClasses: response.data
                    }))
                } else {
                    // response.error is not null
                    console.error(response.error)
                }
            }
        }
        enrolledClassedList();
    }, [dispatch, user, token])


    return (
        <Card sx={{ minWidth: 275, padding: "2rem" }}>

            {user.role === "admin" ? (
                <CardMedia
                    component="img"
                    sx={{ width: "100px", margin: "1rem" }}
                    image={imageRootPath + "admin.jpg"}
                    alt="admin image"
                />
            ) : (
                <CardMedia
                    component="img"
                    sx={{ width: "100px", margin: "1rem" }}
                    image={imageRootPath + "user.jpg"}
                    alt="admin image"
                />
            )}
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <StarIcon fontSize='10px' /><StarIcon fontSize='10px' /><StarIcon fontSize='10px' />
                </Typography>
                <Typography variant="h5" component="div">
                    {user.firstName} {user.lastName}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {user.role} account
                </Typography>
                <Typography variant="body2">
                    {user.email}
                    <br />
                </Typography>
            </CardContent>
            <CardContent>
                {enrolledClassList && (
                    <Box>
                        {user.role === "admin" ? (
                            null
                        ) : (
                            <CardActions>
                                <Button variant="outlined" size="small" sx={{ margin: "0.2rem" }}>Enrolled classes</Button>
                            </CardActions>
                        )}

                        <Typography variant="h5" component="div">
                            {enrolledClassList.map(classItem => <EnrolledClassItem
                                key={classItem._id}
                                classItem={classItem}
                                removeClassHandler={removeClassHandler}
                            />)}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
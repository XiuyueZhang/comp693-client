import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';

export default function EnrolledClassItem(props) {
    const { classItem, removeClassHandler } = props;
    const navigate = useNavigate();

    const navigateToClassDetail = () => {
        const classId = classItem._id;
        navigate(`/classes/${classId}`)
    }

    return (

        <CardContent sx={{ width: "100%" }}>
            <Box display="flex" justifyContent="space-around">
                <Box width="70%" onClick={navigateToClassDetail}
                    sx={{ cursor: 'pointer' }}>
                    <Typography variant="body2" fontWeight={550}>
                        title: {classItem.title}
                    </Typography>
                    <Typography variant="body1">
                        level: {classItem.level}
                    </Typography>
                </Box>

                <IconButton aria-label="delete" size="small" onClick={() => removeClassHandler(classItem._id)}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        </CardContent>
    );
}
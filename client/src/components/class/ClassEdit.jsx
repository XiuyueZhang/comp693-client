import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import styles from './classEdit.module.scss'
import {
    Box, useTheme, useMediaQuery, Button, TextField, Typography, Breadcrumbs, Link,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel
} from "@mui/material";
import Alert from '@mui/material/Alert';

import { adminAddClassRequest, adminUpdateClassRequest, getSelectedClassInfoRequest } from '../../api/requests';
import { setErrorMessage, setSelectedClass } from "../../store"

const ClassEdit = (props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 600px)");
    const location = useLocation();
    const token = useSelector(state => state.auth.token);
    const errorMessage = useSelector(state => state.settings.errorMessage);
    const selectedClass = useSelector(state => state.classes.selectedClass);
    const isAddClassPage = location.pathname === "/admin/class/add"
    const dispatch = useDispatch();
    const { classId } = useParams();

    const [certificateTitle, setCertificateTitle] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [certificateDescription, setCertificateDescription] = useState('');
    const [filesUploaded, setFilesUploaded] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [mp4Files, setMp4Files] = useState([]);
    const [show, setShow] = useState(false);
    const ACCEPTED_FILE_TYPE = { "video/*": [".mp4"] };
    const ACCEPTED_IMG_FILE_TYPE = {
        "image/*": []
    };

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

    const getSelectedClassCall = useCallback(async () => {
        try {
            const response = await getSelectedClassInfoRequest(classId);
            return response;
        } catch (error) {
            throw error; // Rethrow the error to be caught in the useEffect
        }
    }, [classId]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAddClassPage && selectedClass === null) {
                try {
                    // Fetch class info
                    const response = await getSelectedClassCall();
                    if (!response.error) {
                        dispatch(setSelectedClass({
                            selectedClass: response.data
                        }));
                    } else {
                        dispatch(setErrorMessage({
                            errorMessage: response.error
                        }))
                        setShow(true);
                    }
                } catch (error) {
                    dispatch(setErrorMessage({
                        errorMessage: error.message
                    }))
                    setShow(true);
                }
            }
        };

        fetchData();
    }, [isAddClassPage, selectedClass, dispatch, getSelectedClassCall]);


    useEffect(() => {
        if (!isAddClassPage && selectedClass) {
            setSelectedLevel(selectedClass.level)
            setCertificateDescription(selectedClass.description)
            setCertificateTitle(selectedClass.title)
            setSelectedCategory(selectedClass.category)
            setFilesUploaded(selectedClass.videoPath)
        } else {
            setSelectedLevel("")
            setCertificateDescription("")
            setCertificateTitle("")
            setSelectedCategory("")
            setFilesUploaded("")
        }
    }, [isAddClassPage, selectedClass])


    // INPUT HANDLERS
    const handleCertificateTitleChange = (event) => {
        setCertificateTitle(event.target.value);
    };

    const handleLevelChange = (event) => {
        setSelectedLevel(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleCertificateDescriptionChange = (event) => {
        setCertificateDescription(event.target.value);
    };

    // files handlers
    // S3 bucket set up
    const S3_BUCKET = "cloudtech-project-videos";
    const REGION = "ap-southeast-2";

    const s3 = new S3Client({
        region: REGION,
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_Access_Key_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        },
    });

    let uploadedVideoFileUrl = "";
    const mp4FileUpload = async () => {
        const uploadedMp4File = mp4Files[0]
        if (uploadedMp4File) {
            const uploadParams = {
                Bucket: S3_BUCKET,
                Key: `videos/${uploadedMp4File.name}`,
                Body: uploadedMp4File,
                ContentType: 'video/mp4',
            };

            const uploadCommand = new PutObjectCommand(uploadParams);

            try {
                await s3.send(uploadCommand);
                uploadedVideoFileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/videos/${uploadedMp4File.name}`;
                return uploadedVideoFileUrl;
            } catch (error) {
                console.log("Error uploading video file to S3 bucket:", error)
            }
        } else {
            setErrorMessage("No video file uploaded.");
            setShow(true);
        }
    }

    let uploadedImageFileUrl = "";
    const imgFileUpload = async () => {
        const uploadedImgFile = imageFiles[0]
        if (uploadedImgFile) {
            const uploadParams = {
                Bucket: S3_BUCKET,
                Key: `covers/${uploadedImgFile.name}`, // Use file name as the key
                Body: uploadedImgFile,
                ContentType: 'image',
            };

            const uploadCommand = new PutObjectCommand(uploadParams);

            try {
                await s3.send(uploadCommand);
            } catch (error) {
                console.log("Error uploading image file to S3 bucket")
            }
            uploadedImageFileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/covers/${uploadedImgFile.name}`;
            return uploadedImageFileUrl;
        }
    }

    const handleUploadButtonClick = async () => {
        if (isAddClassPage) {
            const videoPathToUpload = await mp4FileUpload();
            const posterPathToUpload = await imgFileUpload();
            if (!videoPathToUpload) {
                setErrorMessage("Video upload failed. Please try again.")
                setShow(true);
            } else if (
                certificateTitle &&
                selectedLevel &&
                videoPathToUpload &&
                selectedCategory &&
                certificateDescription &&
                posterPathToUpload
            ) {
                // Set request body
                const data = {
                    title: certificateTitle,
                    level: selectedLevel,
                    videoPath: videoPathToUpload,
                    category: selectedCategory,
                    description: certificateDescription,
                    isActive: true,
                    poster: posterPathToUpload
                };
                try {
                    // Send request to store data to DB
                    const response = await adminAddClassRequest(data, token, "admin");
                    if (!response.error) {
                        // Redirect to success message page
                        navigate("/admin/success");
                    } else {
                        console.error("Error adding a new class:", response.error);
                        dispatch(setErrorMessage({
                            errorMessage: response.error
                        }))
                        setShow(true)
                    }
                } catch (error) {
                    console.error("Error adding a new class:", error);
                    dispatch(setErrorMessage({
                        errorMessage: error
                    }))
                    setShow(true)
                }
            } else {
                console.error("All fields must be filled");
                dispatch(setErrorMessage({
                    errorMessage: "All fields must be filled"
                }))
                setShow(true)
            }
        } else {
            // Edit page
            let videoPathToUpload = ""
            try {
                videoPathToUpload = await mp4FileUpload();
                if (!videoPathToUpload) {
                    videoPathToUpload = selectedClass.videoPath;
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                dispatch(setErrorMessage({
                    errorMessage: error.message
                }))
                setShow(true)
            }
            let posterPathToUpload = ""
            try {
                posterPathToUpload = await imgFileUpload();
                if (!posterPathToUpload) {
                    posterPathToUpload = "selectedClass.videoPath";
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                dispatch(setErrorMessage({
                    errorMessage: error.message
                }))
                setShow(true)
            }


            if (
                certificateTitle &&
                selectedLevel &&
                videoPathToUpload &&
                selectedCategory &&
                certificateDescription &&
                posterPathToUpload
            ) {
                // Set request body
                const data = {
                    title: certificateTitle,
                    level: selectedLevel,
                    videoPath: videoPathToUpload,
                    category: selectedCategory,
                    description: certificateDescription,
                    isActive: true,
                    poster: posterPathToUpload
                };
                try {
                    // Send request to store data to DB
                    const response = await adminUpdateClassRequest(data, token, "admin", selectedClass._id);
                    if (!response.error) {
                        // Redirect to success message page
                        navigate("/admin/success");
                    } else {
                        console.error("Error adding a new class:", response.error);
                        dispatch(setErrorMessage({
                            errorMessage: response.error
                        }))
                        setShow(true)
                    }
                } catch (error) {
                    console.error("Error adding a new class:", error);
                    dispatch(setErrorMessage({
                        errorMessage: error.message
                    }))
                    setShow(true)
                }
            }
        }
    };


    // Only accept mp4 videos files
    const onDrop = useCallback((acceptedFiles) => {
        // Filter out files that are not of the desired format (MP4)
        const mp4Files = acceptedFiles.filter(file => file.type === 'video/mp4');
        setMp4Files(mp4Files);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPE,
    });

    const files = mp4Files.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));



    // Only accept image files
    const onImageDrop = useCallback((acceptedFiles) => {
        // Filter out files that are not of the desired format (images)
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        setImageFiles(imageFiles);
    }, []);

    const { getRootProps: getRootPropsForImage, getInputProps: getInputPropsForImage } = useDropzone({
        onDrop: onImageDrop,
        accept: ACCEPTED_IMG_FILE_TYPE
    });

    const renderInnerHeader = (
        <Box m="2rem 20%">
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate(-1)}>
                    Class
                </Link>
                <Typography color="text.primary">{isAddClassPage ? "Add" : "Edit"}</Typography>
            </Breadcrumbs>
        </Box>
    )

    const renderCertificateTitle = (
        <Box alignSelf="flex-start" m="0.5rem 20%"
            // should use media to control the size
            // should put the properties into scss
            width={isNonMobileScreens ? "60%" : "70%"} textAlign='center' my="1rem">
            <TextField
                fullWidth
                label="Certificate title"
                id="fullWidth"
                placeholder="Title"
                onChange={handleCertificateTitleChange}
                value={certificateTitle}
            />
        </Box>
    )

    const renderLevelRadioGroup = (
        <Box alignSelf="flex-start" m="0.5rem 20%">
            <FormControl>
                <FormLabel id="level-radio-group">Level</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={handleLevelChange}
                    value={selectedLevel}
                >
                    <FormControlLabel value="Associate" control={<Radio />} label="Associate" />
                    <FormControlLabel value="Professional" control={<Radio />} label="Professional" />
                    <FormControlLabel value="Fundamental" control={<Radio />} label="Fundamental" />
                    <FormControlLabel value="Expert" control={<Radio />} label="Expert" />
                </RadioGroup>
            </FormControl>
        </Box>
    )


    const renderCategoryRadioGroup = (
        <Box alignSelf="flex-start" m="0.5rem 20%">
            <FormControl>
                <FormLabel id="category-radio-group">Category</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                >
                    <FormControlLabel value="aws" control={<Radio />} label="AWS" />
                    <FormControlLabel value="google" control={<Radio />} label="Google" />
                    <FormControlLabel value="azure" control={<Radio />} label="Azure" />
                    <FormControlLabel value="ibm" control={<Radio />} label="IBM" />
                </RadioGroup>
            </FormControl>
        </Box>
    )
    const renderCertificateDescription = (
        <Box width={isNonMobileScreens ? "60%" : "70%"} textAlign='center' my="1rem"
            alignSelf="flex-start" m="0.5rem 20%">
            <TextField
                id="outlined-multiline-flexible"
                label="Certificate description"
                multiline
                minRows={4}
                maxRows={10}
                placeholder="Description"
                fullWidth
                onChange={handleCertificateDescriptionChange}
                value={certificateDescription}
            />
        </Box>
    )

    const renderMp4Dropzone = (
        <section style={{ width: isNonMobileScreens ? "60%" : "70%", alignSelf: "flex-start", margin: "0.5rem 20%" }}>
            <div   {...getRootProps({
                style: {
                    width: '100%',
                    border: '2px dashed #ccc',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                },
            })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop one mp4 file here, or click to select mp4 file</p>
            </div>
            <aside>
                <h4>Video Files</h4>
                <ul>{files.length > 0 ? files : filesUploaded}</ul>
            </aside>
        </section>
    )

    const renderImgDropZone = (
        <section style={{ width: isNonMobileScreens ? "60%" : "70%", alignSelf: "flex-start", margin: "0.5rem 20%"  }}>
            <div {...getRootPropsForImage({
                style: {
                    width: '100%',
                    border: '2px dashed #ccc',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                },
            })}>
                <input {...getInputPropsForImage()} />
                <p>Drag 'n' drop an image file here, or click to select an image file</p>
            </div>
            <aside>
                <h4>Image Files</h4>
                <ul>{
                    imageFiles.length > 0 ? (
                        imageFiles.map(file => (
                            <li key={file.path}>
                                {file.path} - {file.size} bytes
                            </li>
                        ))
                    ) : (isAddClassPage? "":
                        <li>{selectedClass.poster}</li>
                    )}
                </ul>
            </aside>
        </section>
    )



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
                <Box
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                    flexWrap="wrap"
                >
                    {renderInnerHeader}
                    {renderCertificateTitle}
                    {renderLevelRadioGroup}
                    {renderCategoryRadioGroup}
                    {renderCertificateDescription}
                    {renderMp4Dropzone}
                    {renderImgDropZone}

                    {show && (
                        <Box width="60%" display="flex" justifyContent="center" alignItems="center">
                            {errorMessage && (
                                <Alert severity="error" sx={{ width: '100%', textAlign: 'center', margin: "1rem 0" }}>
                                    {errorMessage}
                                </Alert>
                            )}
                        </Box>
                    )}

                    <Box my="2rem">
                        <Button color="primary" variant="contained" onClick={handleUploadButtonClick}>
                            {isAddClassPage ? "Add class" : "Update class"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ClassEdit;
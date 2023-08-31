import React from 'react';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Button,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close,
} from "@mui/icons-material";

import { setMode, setLogout, setfilteredClassList, resetClasses, setErrorMessage, setSuccessMessage } from "../../store"
import FlexBetween from "../widgets/FlexBetween";
import NavbarAdmin from "../navbar/NavbarAdmin";

const Header = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const allClasses = useSelector((state) => state.classes.allClasses);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const isHomepage = (location.pathname === "/") ? true : false;

    const theme = useTheme();
    const neutralLight = theme.palette.neutral?.light;
    const dark = theme.palette.neutral?.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    let fullName = ""
    if (user === null) {
        fullName = ""
    } else {
        fullName = user ? `${user.firstName} ${user.lastName}` : "";
    }


    const handleLogout = () => {
        dispatch(setLogout());
            dispatch(resetClasses());
            dispatch(setErrorMessage({
                errorMessage: ""
            }))
            dispatch(setSuccessMessage({
                successMessage: ""
            }))
        if (user.role === "admin") {
            navigate("/")
        }
    }

    const searchClass = (e) => {
        const searchKeyWord = e.target.value.trim().toLowerCase();
        const filteredClasses = allClasses.filter((classItem) =>
            classItem.title.toLowerCase().includes(searchKeyWord) || classItem.level.toLowerCase().includes(searchKeyWord)
        );
        dispatch(setfilteredClassList({
            filteredClasses: filteredClasses
        }))
    }

    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
            <FlexBetween gap="1.75rem">
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate("/")}
                    sx={{
                        "&:hover": {
                            color: primaryLight,
                            cursor: "pointer",
                        },
                    }}
                >
                    CloudTech
                </Typography>
                {isNonMobileScreens && isHomepage && (
                    <FlexBetween
                        backgroundColor={neutralLight}
                        borderRadius="9px"
                        gap="3rem"
                        padding="0.1rem 1.5rem"
                    >
                        <InputBase
                            placeholder="Search certificate or level..."
                            onChange={searchClass}
                        />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween>
                )}
            </FlexBetween>

            {/* DESKTOP NAV */}
            {isNonMobileScreens ? (
                <FlexBetween gap="2rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx={{ fontSize: "25px" }} />
                        ) : (
                            <LightMode sx={{ color: dark, fontSize: "25px" }} />
                        )}
                    </IconButton>
                    <Message sx={{ fontSize: "25px" }} />
                    <Notifications sx={{ fontSize: "25px" }} />
                    <Help sx={{ fontSize: "25px" }} />
                    {user? (user.role==="admin"?(<NavbarAdmin />):(null)):(null)}
                    

                    {fullName === "" ? (
                        <Button
                            variant="outlined"
                            sx={{ fontSize: "15px" }}
                            onClick={() => {
                                navigate("/login");
                            }}
                        >Sign in/ Sign up</Button>
                    ) : (
                        <FormControl variant="standard" value={fullName}>
                            <Select
                                value={fullName}
                                sx={{
                                    backgroundColor: neutralLight,
                                    width: "150px",
                                    borderRadius: "0.25rem",
                                    p: "0.25rem 1rem",
                                    "& .MuiSvgIcon-root": {
                                        pr: "0.25rem",
                                        width: "3rem",
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: neutralLight,
                                    },
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                            </Select>
                        </FormControl>
                    )}



                </FlexBetween>
            ) : (
                <IconButton
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Menu />
                </IconButton>
            )}

            {/* MOBILE NAV */}
            {!isNonMobileScreens && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    backgroundColor={background}
                >
                    {/* CLOSE ICON */}
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton
                            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* MENU ITEMS */}
                    <FlexBetween
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap="3rem"
                    >
                        <IconButton
                            onClick={() => dispatch(setMode())}
                            sx={{ fontSize: "25px" }}
                        >
                            {theme.palette.mode === "dark" ? (
                                <DarkMode sx={{ fontSize: "25px" }} />
                            ) : (
                                <LightMode sx={{ color: dark, fontSize: "25px" }} />
                            )}
                        </IconButton>
                        <Message sx={{ fontSize: "25px" }} />
                        <Notifications sx={{ fontSize: "25px" }} />
                        <Help sx={{ fontSize: "25px" }} />
                        {user? (user.role==="admin"?(<NavbarAdmin />):(null)):(null)}
                    
                        {fullName === "" ? (
                            <Button
                                variant="outlined"
                                sx={{ fontSize: "15px" }}
                                onClick={() => {
                                    navigate("/login");
                                }}
                            >Sign in/ Sign up</Button>
                        ) : (<FormControl variant="standard" value={fullName}>
                            <Select
                                value={fullName}
                                sx={{
                                    backgroundColor: neutralLight,
                                    width: "150px",
                                    borderRadius: "0.25rem",
                                    p: "0.25rem 1rem",
                                    "& .MuiSvgIcon-root": {
                                        pr: "0.25rem",
                                        width: "3rem",
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: neutralLight,
                                    },
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Log Out
                                </MenuItem>
                            </Select>
                        </FormControl>)}

                    </FlexBetween>
                </Box>
            )}
        </FlexBetween>
    );
};

export default Header;
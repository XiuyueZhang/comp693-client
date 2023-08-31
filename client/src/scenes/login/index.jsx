import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Form from "./Form";

function Login(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const primaryLight = theme.palette.primary.light;
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                textAlign="center"
            >
                <Typography fontWeight="bold" fontSize="32px" color="primary"
                    onClick={() => navigate("/")}
                    sx={{
                        "&:hover": {
                            color: primaryLight,
                            cursor: "pointer",
                        },
                    }}>
                    CloudTech
                </Typography>
            </Box>

            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Elevate Your Tech Journey with CloudTech!
                </Typography>
                <Form />
            </Box>
        </Box>
    );
};

export default Login;
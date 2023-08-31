import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/Footer/footer';
import { Box, useTheme, Typography } from "@mui/material";

const ErrorPage = (props) => {

    const theme = useTheme();

    return (
        <div>
            <Header />
            <Box>
                <Box
                    width="100%"
                    backgroundColor={theme.palette.background.alt}
                    p="1rem 3%"
                    textAlign="center"
                >
                </Box>

                <Box
                    width="90%"
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
                        <Typography variant="title5" color="primary">
                            "Oops, something went wrong..."
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Footer />
        </div>
    )
}

export default ErrorPage;
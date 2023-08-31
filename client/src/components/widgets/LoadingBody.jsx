import React from 'react';
import { Box, useTheme,Typography  } from "@mui/material";

function LoadingBody(props) {
    const theme = useTheme();

    return (
        <div>
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
                        <Typography width="90%">
                            Loading
                        </Typography>
                    </Box>
                </Box>

            </Box>
        </div>
    );
}

export default LoadingBody;
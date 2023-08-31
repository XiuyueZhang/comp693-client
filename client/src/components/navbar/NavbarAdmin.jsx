import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';


const NavbarAdmin = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-navbar">
            <Tooltip title="Add class" arrow>
                <IconButton onClick={() => navigate("/admin/class/add")}>
                    <PlaylistAddIcon sx={{ fontSize: "25px", color: "#1ecbe7" }} />
                </IconButton>
            </Tooltip>
        </div>
    );
}

export default NavbarAdmin;
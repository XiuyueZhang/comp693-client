import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useMediaQuery } from "@mui/material";
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from "react-redux";
import { setfilteredClassList } from "../../store"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const clouds = [
    'AWS',
    'Google',
    "Azure",
    "IBM"
];

export default function MultipleSelect() {
    const [cloudName, setCloudName] = React.useState([]);
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 600px)");
    const allClasses = useSelector((state) => state.classes.allClasses);
    let searchingResult = [];

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        for (let cloudNameForSearch of event.target.value) {
            const searchKeyWord = cloudNameForSearch.toLowerCase();
            const result = filteredCategory(searchKeyWord)
            const index =  event.target.value.indexOf(cloudNameForSearch);
            if(index ===0){
                searchingResult = [...result];
            }else{
                searchingResult.push(...result)
            }
        }
        dispatch(setfilteredClassList({
            filteredClasses: searchingResult
        }))

        setCloudName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const filteredCategory = (searchKeyWord) => {
        // to filter class items based on the category property
        const foundClass = allClasses.filter((classItem) =>
            classItem.category.toLowerCase().includes(searchKeyWord)
        );
        return foundClass;
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: isNonMobileScreens?"300px":"250px" }}>
                <InputLabel id="demo-multiple-name-label">Cloud</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={cloudName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Cloud" />}
                    MenuProps={MenuProps}
                >
                    {clouds.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
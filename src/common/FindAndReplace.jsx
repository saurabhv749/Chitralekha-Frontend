import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Slide, Box, Typography, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProjectStyle from '../styles/ProjectStyle';
import OutlinedTextField from './OutlinedTextField';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FindAndReplace = (props) => {
    const classes = ProjectStyle();
    const {
        sourceData,
        subtitleDataKey,
        onReplacementDone
    } = { ...props }

    const [subtitlesData, setSubtitlesData] = useState();
    const [showFindReplaceModel, setShowFindReplaceModel] = useState(false);
    const [findValue, setFindValue] = useState("");
    const [replaceValue, setReplaceValue] = useState("");
    const [foundIndices, setFoundIndices] = useState([]);
    const [currentFound, setCurrentFound] = useState();

    useEffect(() => {
        setSubtitlesData(sourceData);
    }, [sourceData, subtitleDataKey])

    const resetComponentValue = () => {
        // setSubtitlesData();
        setFindValue("");
        setReplaceValue("");
        setFoundIndices([]);
        setCurrentFound()
    }

    const handleCloseModel = () => {
        setShowFindReplaceModel(false);
        resetComponentValue()
    }
    const handleOpenModel = () => {
        setShowFindReplaceModel(true);
    }

    const onFindClick = () => {
        const textToFind = findValue.toLowerCase()
        const indexListInDataOfTextOccurence = [];
        subtitlesData.map((item, index) => {
            if (item[subtitleDataKey].toLowerCase().includes(textToFind)) {
                indexListInDataOfTextOccurence.push(index);
            }
        });

        setFoundIndices(indexListInDataOfTextOccurence);

        if (indexListInDataOfTextOccurence?.length > 0) {
            setCurrentFound(0)
        }
    }

    const previousOccurenceClick = () => {
        setCurrentFound(currentFound - 1);
        const scrollableElement = document.getElementById("subtitle_scroll_view");
        scrollableElement.querySelector(`#sub_${foundIndices[currentFound - 1]}`).scrollIntoView(true, {block: "start"});
    }

    const nextOccurenceClick = () => {
        setCurrentFound(currentFound + 1);
        const scrollableElement = document.getElementById("subtitle_scroll_view");
        scrollableElement.querySelector(`#sub_${foundIndices[currentFound + 1]}`).scrollIntoView(true, {block: "start"});
    }

    const onReplaceClick = () => {
        const currentSubtitleSource = [...subtitlesData];
        const updatedSubtitleData = [];
        currentSubtitleSource.map((ele, index) => {
            if (foundIndices[currentFound] === index) {
                const textToReplace = ele[subtitleDataKey].replace(new RegExp(findValue, 'gi'), replaceValue);
                ele[subtitleDataKey] = textToReplace;
            }

            updatedSubtitleData.push(ele);
        })
        setSubtitlesData(updatedSubtitleData);
        onReplacementDone(updatedSubtitleData);
        handleCloseModel();
    }

    const onReplaceAllClick = () => {
        const currentSubtitleSource = [...subtitlesData];
        const updatedSubtitleData = [];
        currentSubtitleSource.map((ele, index) => {
            if (foundIndices?.includes(index)) {
                const textToReplace = ele[subtitleDataKey].replace(new RegExp(findValue, 'gi'), replaceValue);
                ele[subtitleDataKey] = textToReplace;
            }
            updatedSubtitleData.push(ele);
        })
        setSubtitlesData(updatedSubtitleData);
        onReplacementDone(updatedSubtitleData);
        handleCloseModel();
    }

    return (
        <>
            <Button
                variant="contained"
                className={classes.findreplBtn}
                onClick={handleOpenModel}
            >
                Find / Replace
            </Button>
            <Dialog
                open={showFindReplaceModel}
                TransitionComponent={Transition}
                onClose={handleCloseModel}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"lg"}
            >
                <Grid
                    display="flex"
                    justifyContent={"space-between"}
                    sx={{ backgroundImage: "linear-gradient(to right, #f1f1f1, #ffffff)", width: "100%", paddingX: 1 }}
                >
                    <Grid item sx={{ alignSelf: "center" }}><DialogTitle
                    >Find and Replace</DialogTitle>
                    </Grid>
                    <Grid item><Button
                        variant="outlined"
                        onClick={handleCloseModel}
                        sx={{
                            color: "#000",
                            border: "none",
                            height: "60px",
                            "&:hover": {
                                border: "none"
                            }
                        }}
                    >
                        <CloseIcon />
                    </Button></Grid>
                </Grid>
                <DialogContent
                    sx={{ overflow: "hidden", position: "unset", overscrollBehavior: "none" }}
                >

                    <Grid
                        container
                        flexDirection={"flex"}
                        justifyContent="space-around"
                    >
                        <Grid
                            md={4}
                            sx={{ marginTop: 2 }}
                        >
                            <OutlinedTextField
                                autoFocus
                                value={findValue}
                                onChange={e => setFindValue(e.target.value)}
                                margin="dense"
                                id="name"
                                label="Find"
                                type="Find"
                                fullWidth
                                variant="standard"
                            />
                            <Typography variant="caption" display={"flex"} sx={{justifyContent: "end", paddingTop: 1}}>{ foundIndices?.length > 0 && `${currentFound+1} / ${foundIndices?.length}` }</Typography>
                            <Grid
                                display={"flex"}
                                justifyContent={"space-between"}
                                sx={{ textAlign: foundIndices?.length > 0 ? "center" : "end" }}
                            >
                                {foundIndices?.length > 0 && <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={currentFound === 0}
                                    onClick={previousOccurenceClick}
                                >
                                    <ChevronLeft />
                                </Button>}
                                <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={!findValue}
                                    onClick={onFindClick}
                                >
                                    Find
                                </Button>
                                {foundIndices?.length > 0 && <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={currentFound === foundIndices.length - 1}
                                    onClick={nextOccurenceClick}
                                >
                                    <ChevronRight />
                                </Button>}
                            </Grid>
                            <OutlinedTextField
                                value={replaceValue}
                                onChange={e => setReplaceValue(e.target.value)}
                                margin="dense"
                                id="name"
                                label="Replace"
                                type="Replace"
                                fullWidth
                                variant="standard"
                                disabled={!(foundIndices?.length > 0)}
                            />
                            <Grid
                                display={"flex"}
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                            >
                                <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={!replaceValue}
                                    onClick={onReplaceClick}
                                >
                                    Replace
                                </Button>
                                <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={!replaceValue}
                                    onClick={onReplaceAllClick}
                                    style={{width: "auto"}}
                                >
                                    Replace All
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            md={8}
                            width={"100%"}
                            textAlign={"-webkit-center"}
                            height={window.innerHeight * 0.7}
                            sx={{ overflowY: "scroll" }}
                            paddingBottom={5}
                            id={"subtitle_scroll_view"}
                        >
                            {subtitlesData?.map((el, i) => {
                                return (
                                    <Box
                                        id={`sub_${i}`}
                                        textAlign={"start"}
                                        sx={{
                                            marginY: 2, padding: 2, border: "1px solid #000000", borderRadius: 2, width: "50%",
                                            backgroundColor: foundIndices.includes(i) ? foundIndices[currentFound] === i ? "yellow" : "black" : "#ffffff",
                                            color: foundIndices.includes(i) ? foundIndices[currentFound] === i ? "red" : "#ffffff" : "black",
                                        }}
                                    >
                                        {el[subtitleDataKey]}
                                    </Box>
                                )
                            })}
                        </Grid>
                    </Grid>

                </DialogContent>
            </Dialog>
        </>

    )
}

export default FindAndReplace
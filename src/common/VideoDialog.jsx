import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FetchVideoDetailsAPI from "../redux/actions/api/Project/FetchVideoDetails";
import APITransport from "../redux/actions/apitransport/apitransport";
import { Box } from "@mui/system";
import ProjectStyle from "../styles/ProjectStyle";
import VideoTaskList from "../containers/Organization/Project/VideoTaskList";
import { useVideoSubtitle } from "../hooks/useVideoSubtitle";
import { getTimeStamp, getMilliseconds } from "../utils/utils";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const VideoDialog = ({ open, handleClose, videoDetails }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [time, setTime] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [highlightedSubtitle, setHighlightedSubtitle] = useState([]);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [playpause, setplaypause] = useState(false);
  const ref = useRef(null);
  const { subtitle } = useVideoSubtitle(videoDetails[0].id);

  const classes = ProjectStyle();

  useEffect(() => {
    const subtitleList = Object.values(subtitle);
    const subs = subtitleList.filter((subtitleSentence) => {
      const { start_time, end_time, timestamps } = subtitleSentence;
      if (!!start_time && !!end_time && !!timestamps) {
        const start = getMilliseconds(start_time);
        const currentTime = getMilliseconds(time);
        const end = getMilliseconds(end_time);
        if (currentTime > start && currentTime <= end) {
          return true;
        } else {
          setHighlightedSubtitle([]);
        }
      }
      return false;
    });
    setSubtitles(subs);
  }, [time]);

  useEffect(() => {
    processSubtitleData();
  }, [subtitles]);

  const getHighlightedWords = (index, currentTime, word, start, end) => {
    return (
      <span
        key={`word-${index}`}
        style={{
          color:
            currentTime >= start && currentTime <= end
              ? "orange"
              : currentTime >= start
              ? "white"
              : "grey",
        }}
      >{`${word} `}</span>
    );
  };

  const processSubtitleData = () => {
    subtitles.length &&
      subtitles.forEach((subtitle) => {
        setHighlightedSubtitle([]);
        subtitle.timestamps.forEach((timestamp, index) => {
          const text = Object.keys(timestamp)[0];
          const { start, end } = timestamp[text];
          const currentTime = getMilliseconds(time);
          const startTime = getMilliseconds(start);
          const endTime = getMilliseconds(end);
          setHighlightedSubtitle((prev) => [
            ...prev,
            getHighlightedWords(index, currentTime, text, startTime, endTime),
          ]);
        });
      });
  };

  useEffect(() => {
    const apiObj = new FetchVideoDetailsAPI(
      videoDetails[0].url,
      videoDetails[0].language,
      videoDetails[0].project_id,
      videoDetails[0].audio_only
    );
    dispatch(APITransport(apiObj));
  }, []);

  const onFullScreenChange = (status) => {
    setFullScreenMode(status);
  };

  useEffect(() => {
    window.onresize = function () {
      if (
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.document.fullscreenElement
      ) {
        onFullScreenChange(true);
      } else {
        onFullScreenChange(false);
      }
    };
  }, []);

  const video = useSelector((state) => state.getVideoDetails.data);

  //callback function called when the video is being played
  const handleProgress = () => {
    const time = getTimeStamp(ref?.current?.currentTime);
    setTime(time);
  };

  const handleFullscreenVideo = () => {
    let docElm = document.getElementById("myvideo");
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null);

// var docElm = document.documentElement;
if (!isInFullScreen) {
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
} else {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
  };




  const handleplayVideo = () =>{
   
    var btn = document.getElementById("myBtn");
      if (btn.paused) {
        setplaypause(true)
        btn.play();
       
      }  else {
        setplaypause(false)
        btn.pause();
        
      }
    
  }

  console.log(playpause,"playpausev")
  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={"xl"}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <Typography variant="h4" style={{ marginRight: "auto" }}>
          {videoDetails[0].name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid className={classes.videoBox}  id="myvideo" >
          <video
             id="myBtn"
            ref={ref}
            style={fullScreenMode ? { } : { width: "500px" }}
           // controls
            src={video.direct_video_url}
            className={classes.video}
            onTimeUpdate={handleProgress}
            onClick={() => handleplayVideo()}
          />
          <div
            className={classes.subtitle}
            style={fullScreenMode ? { zIndex:100,fontSize:'40px',} : {}}
          >
            {highlightedSubtitle.length ? (
              highlightedSubtitle.map((s) => s)
            ) : (
              <></>
            )}
          </div>
            <Box>
              {fullScreenMode ? (
                <Button
                  className={classes.fullscreenVideoBtns}
                  aria-label="fullscreen"
                  onClick={() => handleFullscreenVideo()}
                  variant="contained"
                  style={{
                    right: fullScreenMode ? "5%" : "",
                  }}
                >
                  <FullscreenExitIcon sx={{fontSize:"40px"}} />
                </Button>
              ) : (
                <Button
                  className={classes.fullscreenVideoBtns}
                  aria-label="fullscreenExit"
                  onClick={() => handleFullscreenVideo()}
                  variant="contained"
                >
                  <FullscreenIcon />
                </Button>
              )}
            </Box>
          
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: "24px" }}>
        <Typography variant="body1" style={{ marginRight: "auto" }}>
          Duration: {videoDetails[0].duration}
        </Typography>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
      <div style={{ padding: "0px 20px 20px 20px" }}>
        <VideoTaskList videoDetails={videoDetails[0].id} />
      </div>
    </Dialog>
  );
};

export default VideoDialog;

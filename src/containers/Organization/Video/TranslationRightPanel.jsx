// TranslationRightPanel

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, CardContent, Divider, } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ProjectStyle from "../../../styles/ProjectStyle";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { useParams,useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import '../../../styles/ScrollbarStyle.css';

const TranslationRightPanel = () => {
  const { taskId,orgId,projectId } = useParams();
  const classes = ProjectStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const transcriptPayload = useSelector((state) => state.getTranscriptPayload.data);
  const taskData = useSelector((state)=>state.getTaskDetails.data);
  const assignedOrgId = JSON.parse(localStorage.getItem('userData'))?.organization?.id
  
  const [sourceText, setSourceText] = useState([]);
  const [lang, setLang] = useState("hi");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
 
 

  useEffect(() => {
    setSourceText(transcriptPayload?.payload?.payload)
  }, [transcriptPayload?.payload?.payload]);

  const changeTranscriptHandler = (target, index) => {
    const arr = [...sourceText];
    arr.forEach((element, i) => {
      if(index === i) {
        element.target_text = target.value
      }
    });

    setSourceText(arr);
    saveTranscriptHandler(false)
  }

  const saveTranscriptHandler = async(isFinal) => {
    const reqBody = {
      task_id: taskId,
      payload: {
        payload: sourceText
      }
    };

    if(isFinal){
      reqBody.final = true
    }

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
    //dispatch(APITransport(obj));
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message:  resp?.message,
        variant: "success",
      })
      if(isFinal){
          setTimeout(() => {
              navigate(`/my-organization/:${assignedOrgId}/project/:${taskData?.project}`);
          }, 2000);
      }
      //navigate(`/my-organization/:${orgId}/project/:${projectId}`)
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
  }

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <>{renderSnackBar()}
    <Box
      sx={{
        display: "flex",
        borderLeft: "1px solid #eaeaea",
      }}
    //   width="25%"
      flexDirection="column"
    >
      <Box display="flex">
        {/* <Button variant="contained" className={classes.findBtn}>
          Find/Search
        </Button> */}
        <Button variant="contained" className={classes.findBtn} onClick={() => saveTranscriptHandler(true)}>
          Save
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #eaeaea",
          overflowY: "scroll",
          overflowX: "hidden",
          height: window.innerHeight*0.75,
          backgroundColor:"black",
          color:"white",
          marginTop: "5px"
        }}
        className={"subTitleContainer"}
      >
        {
          sourceText?.map((item, index) => {
            return (<>
              <Box display="flex" padding="16px" sx={{paddingX: 0, justifyContent: "space-around"}} >
                <TextField variant="outlined" value={item.start_time} sx={{
                  "& .MuiOutlinedInput-root": {
                    width: "85%",
                    backgroundColor:"#616A6B  ",
                    color:"white"
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "12px",
                    padding: "7px 14px",
                  }
                }}/>

                <TextField variant="outlined" value={item.end_time} sx={{
                  "& .MuiOutlinedInput-root": {
                    width: "85%",
                    marginLeft: "auto",
                    backgroundColor:"#616A6B",
                    color:"white"
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "12px",
                    padding: "7px 14px",
                  }
                }}/>
              </Box>
              {/* <IndicTransliterate
                lang={"hi"}
                value={item.text}
                onChangeText={(text, index) => {
                }}
                onChange={(event) => {
                  changeTranscriptHandler(event.target, index)
                }}
                renderComponent={(props) => (
                  <textarea className={classes.customTextarea} rows={3} {...props} />
                )}
              /> */}
              <CardContent sx={{display: "flex", paddingX: 0, borderBottom: 2}}>
              <textarea rows={4} 
              className={classes.textAreaTransliteration}
              contentEditable={false}
              //   className={({ isActive }) =>
              //   isActive ? classes.textAreaTransliteration : classes.headerMenu
              // }
              // activeClassName={classes.textAreaTransliteration}
              defaultValue={item.text} 
            //    onChange={(event) => {
            //     changeTranscriptHandler(event.target, index)
                
            //   }}
               />
               <IndicTransliterate
                lang={taskData?.target_language}
                value={item.target_text}
                onChangeText={(text, index) => {
                }}
                onChange={(event) => {
                  changeTranscriptHandler(event.target, index)
                }}
                containerStyles={{
                    width: "100%"
                }}
                
                renderComponent={(props) => (
                  <textarea className={classes.textAreaTransliteration} rows={4} {...props} />
                )}
              />
               {/* <textarea rows={4} 
              className={classes.textAreaTransliteration}
              //   className={({ isActive }) =>
              //   isActive ? classes.textAreaTransliteration : classes.headerMenu
              // }
              // activeClassName={classes.textAreaTransliteration}
              value={item.target_text} 
               onChange={(event) => {
                changeTranscriptHandler(event.target, index)
                
              }}
               /> */}
               </CardContent>
               {/* <CardContent>
              
               </CardContent> */}
            </>)
          })
        }
      </Box>
    </Box>
    </>
  );
};

export default TranslationRightPanel;

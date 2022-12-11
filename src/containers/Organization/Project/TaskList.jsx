import React, { useEffect, useState } from "react";

//Themes
import { ThemeProvider, Box, Grid, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";


//Components
import MUIDataTable from "mui-datatables";
import CustomButton from "../../../common/Button";
import CustomizedSnackbars from "../../../common/Snackbar";

//Apis
import FetchTaskListAPI from "../../../redux/actions/api/Project/FetchTaskList";
import APITransport from "../../../redux/actions/apitransport/apitransport";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ViewTaskDialog from "../../../common/ViewTaskDialog";
import { useNavigate } from "react-router-dom";
import DatasetStyle from "../../../styles/Dataset";
import CompareTranscriptionSource from "../../../redux/actions/api/Project/CompareTranscriptionSource";
import setComparisonTable from "../../../redux/actions/api/Project/SetComparisonTableData";
import clearComparisonTable from "../../../redux/actions/api/Project/ClearComparisonTable";
import DeleteTaskAPI from "../../../redux/actions/api/Project/DeleteTask";
import ComparisionTableAPI from "../../../redux/actions/api/Project/ComparisonTable";
import exportTranscriptionAPI from "../../../redux/actions/api/Project/ExportTranscrip";

const  Transcription = ["srt","vtt","txt"," ytt"]
const  Translation = ["srt","vtt","txt"]
const TaskList = () => {
  const { orgId,projectId } = useParams();
  const dispatch = useDispatch();
  const classes = DatasetStyle();

  const [openViewTaskDialog, setOpenViewTaskDialog] = useState(false);
  const [currentTaskDetails, setCurrentTaskDetails] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [taskid, setTaskid] = useState();
  const[tasktype,setTasktype]= useState();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [exportTranscription, setExportTranscription] = useState("srt");
  const [exportTranslation, setexportTranslation] = useState("srt");
  const [taskdata, setTaskdata] = useState();

  const navigate = useNavigate();

  const FetchTaskList = () => {
    const apiObj = new FetchTaskListAPI(projectId);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId");
    FetchTaskList();
  }, []);

 

  const taskList = useSelector((state) => state.getTaskList.data);

  const Transcrip = taskList.task_type === "TRANSCRIPTION_EDIT" || 	taskList.task_type === "TRANSCRIPTION_REVIEW"
  
  console.log(taskList.task_type,"taskListtaskList",Transcrip)
  // const getTranscriptionSourceComparison = (id, source) => {
    const datvalue = useSelector((state) => state.getExportTranscription.data);  
    console.log(datvalue,"datvaluedatvalue",taskList.task_type)
    const handleClose = () => {
      setOpen(false);
  };
  const handleCloseDialog = () =>{
    setOpenDialog(false);
  }

  const handleClickOpen = (id) => {
    setOpen(true);
    setTaskdata(id)
};

const handleok = async() => {
  const apiObj = new exportTranscriptionAPI(taskdata,exportTranscription);
  //dispatch(APITransport(apiObj));
  setOpen(false);
  const res = await fetch(apiObj.apiEndPoint(), {
    method: "GET",
    body: JSON.stringify(apiObj.getBody()),
    headers: apiObj.getHeaders().headers,
  });
  const resp = await res.json();
  if (res.ok) {
    console.log(resp,"respresp")
    setSnackbarInfo({
      open: true,
      message:  resp?.message,
      variant: "success",
    })
   
  } else {
    setSnackbarInfo({
      open: true,
      message: resp?.message,
      variant: "error",
    })
  }
}

const handleClickRadioButton = (e) =>{
  setExportTranscription(e.target.value);
}
const handleClickexportTranslationRadioButton =(e) =>{
  setexportTranslation(e.target.value);
}

  const onTranslationTaskTypeSubmit = async (id, rsp_data) => {
    const payloadData = {
      type: Object.keys(rsp_data.payloads)[0],
      payload: {
        payload: rsp_data.payloads[Object.keys(rsp_data.payloads)[0]]?.payload,
      },
    };
    const comparisonTableObj = new ComparisionTableAPI(id, payloadData);
    dispatch(APITransport(comparisonTableObj));

    navigate(`/${id}/translate`);
  }

  const getTranscriptionSourceComparison = (id, source, isSubmitCall) => {
    const sourceTypeList = source.map((el) => {
      return el.toUpperCase().split(" ").join("_");
    });
    const apiObj = new CompareTranscriptionSource(id, sourceTypeList);
    localStorage.setItem("sourceTypeList", JSON.stringify(sourceTypeList));
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      const rsp_data = await res.json();
      console.log("rsp_data --------- ", rsp_data);
      if (res.ok) {
        dispatch(setComparisonTable(rsp_data));
        if (isSubmitCall) {
          // --------------------- if task type is translation, submit translation with trg lang ------------- //
          await onTranslationTaskTypeSubmit(id, rsp_data);
        }
      } else {
        console.log("failed");
      }
    });
  };

  useEffect(() => {
    let taskId;
    taskList?.map((element, index) => {
      taskId = element.id;  
    });
    setTaskid(taskId);
   
  }, [taskList]);
  

  const handledeletetask = async () => {
    setOpenDialog(true);
  };
  const handleokDialog= async() =>{
    setOpenDialog(false);
     const apiObj = new DeleteTaskAPI(taskid);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "DELETE",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message:  resp?.message,
        variant: "success",
      })
      FetchTaskList();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
  }

  const renderViewButton = (tableData) => {
    console.log(tableData, "tableDatatableData");
    
    return (
      (tableData.rowData[5] === "NEW" ||
        tableData.rowData[5] === "INPROGRESS") && (
        <CustomButton
        className={classes.tableButton}
          label="View"
          onClick={() => {
            setOpenViewTaskDialog(true);
            setCurrentTaskDetails(tableData.rowData);
          }}
        />
      )
    );
  };
  const renderExportButton = (tableData) => {
    console.log(tableData, "tableData");
    return (
      (tableData.rowData[5] === "COMPLETE"  && (
        <CustomButton
        className={classes.tableButton}
          label="Export"
          onClick={() =>  handleClickOpen(tableData.rowData[0]) }
        />
      )
    ));
       // })
  };

  const renderEditButton = (tableData) => {
    console.log("tableData ---- ", tableData);
    return(
      ((tableData.rowData[5] === "SELECTED_SOURCE" && (tableData.rowData[1] === "TRANSCRIPTION_EDIT" || tableData.rowData[1] === "TRANSLATION_EDIT")) 
      || (tableData.rowData[1] === "TRANSCRIPTION_REVIEW" || tableData.rowData[1] === "TRANSLATION_REVIEW")) && 
      <CustomButton
      className={classes.tableButton}
        label="Edit"
        onClick={() => {
          navigate(`/${tableData.rowData[0]}/transcript`);
          console.log("Edit Button ---- ", tableData.rowData);
          // setOpenViewTaskDialog(true);
          // setCurrentTaskDetails(tableData.rowData);
        }}
      />
    )
      
  }

  const renderDeleteButton = (tableData) => {
    return (
      <CustomButton
        className={classes.tableButton}
        color="error"
        label="Delete"
        onClick={handledeletetask}
      />
    );
  };

  const columns = [
    {
      name: "id",
      label: "#",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px",textAlign: "center" },
        }),
      },
    },
    {
      name: "task_type",
      label: "Task Type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px",textAlign: "center" },
        }),
        setCellProps:() =>({  style: { textAlign: "center" }})
      },
    },
    {
      name: "video_name",
      label: "Video Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px",textAlign: "center" },
        }),
        setCellProps:() =>({  style: { textAlign: "center" }})
      },
    },
    {
      name: "src_language",
      label: "Source Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px",textAlign: "center" },
        }),
        setCellProps:() =>({  style: { textAlign: "center" }})
      },
    },
    {
      name: "target_language",
      label: "Target Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" ,textAlign: "center"},
        }),
        setCellProps:() =>({  style: { textAlign: "center" }})
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px",textAlign: "center" },
        }),
        setCellProps:() =>({  style: { textAlign: "center" }})
      },
    },
    {
      name: "Action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", textAlign: "center" },
        }),
        setCellProps:() =>({  style: { textAlign: "center" }}),
        customBodyRender: (value, tableMeta) => {
          console.log(value,"valuevalue",tableMeta)
          return (
            <Box sx={{ display: "flex" }}>
              {renderViewButton(tableMeta)}
              {renderEditButton(tableMeta)}
              {renderExportButton(tableMeta)}
              {renderDeleteButton(tableMeta)}
            </Box>

            // <CustomButton
            //   sx={{ borderRadius: 2, marginRight: 2 }}
            //   label="View"
            //   onClick={() => {
            //     setOpenViewTaskDialog(true);
            //     setCurrentTaskDetails(tableMeta.rowData);
            //   }}
            // />
          );
        },
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

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

  const renderDialog = () =>{
    return(
    <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
>
    <DialogContent>

        <DialogContentText id="alert-dialog-description"  align="center" sx={{mb:2,color:"black",fontSize:"25px"}}>
        Export Subtitle
        </DialogContentText>
        <Divider/>
        
        <DialogContentText id="alert-dialog-description" sx={{mt:2}}>
      Transcription 
        </DialogContentText>
       
        <DialogActions sx={{mr:10,mb:1,mt:1}}>
         
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
          {Transcription?.map((item, index) => (
        <FormControlLabel value={item} control={<Radio />} checked={exportTranscription === item} label={item}  onClick={handleClickRadioButton}/>
        ))}
      </RadioGroup>
      </FormControl>
    </DialogActions>
    <DialogActions>
        <CustomButton onClick={handleClose} label="Cancel" />
        <CustomButton onClick={handleok} label="Export" autoFocus />
    </DialogActions>
    </DialogContent>
   
</Dialog>
    )
  }

  return (
    <>
      <Grid>{renderSnackBar()}</Grid>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={taskList} columns={columns} options={options} />
      </ThemeProvider>

      {openViewTaskDialog && (
        <ViewTaskDialog
          open={openViewTaskDialog}
          handleClose={() => setOpenViewTaskDialog(false)}
          compareHandler={(id, source, isSubmitCall) => {
            dispatch(clearComparisonTable());
            localStorage.setItem("sourceId", id);
            if (source.length)
              getTranscriptionSourceComparison(id, source, isSubmitCall);
            !isSubmitCall && navigate(`/comparison-table/${id}`);
          }}
          // submitHandler={({id, source}) => {

          // }}
          id={currentTaskDetails[0]}
        />
      )}
      {renderDialog()}
     
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure, you want to delete this task? The associated transcript/translation will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleCloseDialog} label="Cancel" />
          <CustomButton  onClick={()=>handleokDialog()} label="Ok" autoFocus />
        </DialogActions>
      </Dialog>


    </>
  );
};

export default TaskList;

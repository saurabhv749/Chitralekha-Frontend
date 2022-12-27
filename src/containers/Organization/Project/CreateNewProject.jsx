import {
  Card,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OutlinedTextField from "../../../common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import Button from "../../../common/Button";
import CreateNewProjectAPI from "../../../redux/actions/api/Project/CreateNewProject";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import CustomizedSnackbars from "../../../common/Snackbar";
import FetchOrganizatioProjectManagersUserAPI from "../../../redux/actions/api/Organization/FetchOrganizatioProjectManagersUser";
import FetchTranscriptTypesAPI from "../../../redux/actions/api/Project/FetchTranscriptTypes";
import FetchTranslationTypesAPI from "../../../redux/actions/api/Project/FetchTranslationTypes";

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

const CreatenewProject = () => {
  const { orgId } = useParams();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const newProjectDetails = useSelector(
    (state) => state.getNewProjectDetails.data
  );
  const userList = useSelector(
    (state) => state.getOrganizatioProjectManagersUser.data
  );
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const translationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [managerUsername, setManagerUsername] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [transcriptSourceType, setTranscriptSourceType] =
    useState("MACHINE_GENERATED");
  const [translationSourceType, setTranslationSourceType] =
    useState("MACHINE_GENERATED");

  const getOrganizatioUsersList = () => {
    const projectrole = "PROJECT_MANAGER";
    const userObj = new FetchOrganizatioProjectManagersUserAPI(
      orgId,
      projectrole
    );
    dispatch(APITransport(userObj));
  };

  const getSourceTypes = () => {
    const transcriptObj = new FetchTranscriptTypesAPI();
    dispatch(APITransport(transcriptObj));

    const translationObj = new FetchTranslationTypesAPI();
    dispatch(APITransport(translationObj));
  };

  useEffect(() => {
    getOrganizatioUsersList();
    getSourceTypes();
  }, []);

  const handeleselectManager = (event, item) => {
    const {
      target: { value },
    } = event;
    setManagerUsername(typeof value === "string" ? value.split(",") : value);
  };

  const handleCreateProject = async () => {
    const newPrjectReqBody = {
      title: title,
      description: description,
      organization_id: orgId,
      managers_id: managerUsername,
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
    };

    const apiObj = new CreateNewProjectAPI(newPrjectReqBody);
    // dispatch(APITransport(apiObj));
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      navigate(`/my-organization/${orgId}/project/${newProjectDetails.id}`, {
        replace: true,
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
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

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      {renderSnackBar()}
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom component="div">
          Create a Project
        </Typography>

        <Box>
          <Typography gutterBottom component="div" label="Required">
            Title*
          </Typography>
          <OutlinedTextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required" multiline>
            Description
          </Typography>
          <OutlinedTextField
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Managers*
          </Typography>
          <FormControl fullWidth>
            <Select
              id="demo-multiple-name"
              multiple
              value={managerUsername}
              onChange={handeleselectManager}
              MenuProps={MenuProps}
            >
              {userList.map((name) => (
                <MenuItem key={name.id} value={name.id}>
                  {name.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Select Transcription Source
          </Typography>
          <FormControl fullWidth>
            <Select
              id="transcript-source-type"
              value={transcriptSourceType}
              onChange={(event) => setTranscriptSourceType(event.target.value)}
              MenuProps={MenuProps}
            >
              {transcriptTypes.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Select Translation Source
          </Typography>
          <FormControl fullWidth>
            <Select
              id="translation-source-type"
              value={translationSourceType}
              onChange={(event) => setTranslationSourceType(event.target.value)}
              MenuProps={MenuProps}
            >
              {translationTypes.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            style={{ margin: "0px 20px 0px 0px" }}
            label={"Create Project"}
            onClick={() => handleCreateProject()}
            disabled={title && managerUsername ? false : true}
          />
          <Button
            label={"Cancel"}
            onClick={() => navigate(`/my-organization/${orgId}`)}
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default CreatenewProject;

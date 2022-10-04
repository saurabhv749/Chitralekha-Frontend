import {
  Grid,
  Link,
  ThemeProvider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { translate } from "../../config/localisation";
import LoginStyle from "../../styles/loginStyle";
import Button from "../../common/Button";
import CustomCard from "../../common/Card";
import OutlinedTextField from "../../common/OutlinedTextField";
import themeDefault from "../../theme/theme";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AppInfo from "./AppInfo";
import CustomizedSnackbars from "../../common/Snackbar";
import LoginAPI from '../../redux/actions/api/User/Login';

const Login = () => {
  const classes = LoginStyle();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [isPressed, setIsPressed] = useState(false);

  const keyPress = (e) => {
    if (e.code === "Enter") {
      if (!isPressed) {
        setIsPressed(true);
        createToken();
      }
    }
  };

  const keyRelease = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", keyPress);
    window.addEventListener("keyup", keyRelease);
    return () => {
      window.removeEventListener("keydown", keyPress);
      window.removeEventListener("keyup", keyRelease);
    };
  }, [keyPress, keyRelease]);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setCredentials((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const createToken = () => {
    const apiObj = new LoginAPI(credentials.email, credentials.password);
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (res) => {
        const rsp_data = await res.json();
        console.log(rsp_data);
        if (!res.ok) {
          // return Promise.reject('');
          // let errorObj =
          console.log("res -", res);
          setSnackbarInfo({
            open: true,
            variant: "error",
            message: "Username or Password incorrect.",
            // message: rsp_data.detail
          });
        } else {
          localStorage.setItem("token", rsp_data.token);
          localStorage.setItem("userInfo", JSON.stringify(rsp_data.user));
          navigate("/projects");
        }
      })
      .catch((error) => {
        setSnackbarInfo({ open: true, variant: "error", message: error });
      });
  };

  const TextFields = () => {
    return (
      <Grid container spacing={2} style={{ marginTop: "2px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="email"
            onChange={handleFieldChange}
            value={credentials["email"]}
            placeholder={translate("enterEmailId")}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="password"
            type={values.showPassword ? "text" : "password"}
            onChange={handleFieldChange}
            value={credentials["password"]}
            placeholder={translate("enterPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    );
  };
  const renderCardContent = () => (
    <CustomCard title={"Sign in to Chitralekha"} cardContent={TextFields()}>
      <Grid container spacing={2} style={{ width: "100%" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} textAlign={"right"}>
          <Link onClick={() => navigate("/forgot-password")}>
            {translate("forgotPassword")}
          </Link>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button fullWidth onClick={createToken} label={"Login"} />
        </Grid>
      </Grid>
    </CustomCard>
  );

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid container>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          lg={3}
          color={"primary"}
          className={classes.appInfo}
        >
          <AppInfo />
        </Grid>
        <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent}>
          <form autoComplete="off">{renderCardContent()}</form>
        </Grid>
        {renderSnackBar()}
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
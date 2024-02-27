import { SigninErrors, TeacherSignupData, UserRecord } from "@celluloid/types";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import DialogAltButtons from "components/DialogAltButtons";
import DialogButtons from "components/DialogButtons";
import DialogError from "components/DialogError";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { AnyAction } from "redux";
import { Action } from "types/ActionTypes";
import { PeertubeVideoInfo } from "types/YoutubeTypes";
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

interface Props {
  user?: UserRecord;
  video?: PeertubeVideoInfo;
  data: TeacherSignupData;
  errors: SigninErrors;
  confirmPasswordError: boolean;
  onChange(name: string, value: string): void;
  onClickLogin(): Action<null>;
  onSubmit(): Promise<AnyAction>;
}

const SignupComponent = ({
  data,
  user,
  video,
  errors,
  confirmPasswordError,
  onChange,
  onSubmit,
  onClickLogin,
}: Props) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div>
      {video && user && (
        <Typography gutterBottom={true} variant="subtitle2" color="primary">
          {t("signin.upgradeAccountMessage")}
        </Typography>
      )}
      {video && !user && (
        <Typography gutterBottom={true} variant="subtitle2" color="primary">
          {t("signin.signupOrLoginMessage")}
        </Typography>
      )}
      <TextField
        margin="dense"
        fullWidth={true}
        error={errors.username ? true : false}
        label={t("signin.username")}
        value={data.username}
        required={true}
        onChange={(event) => onChange("username", event.target.value)}
        helperText={errors && errors.username}
      />
      <TextField
        margin="dense"
        fullWidth={true}
        error={errors.email ? true : false}
        label={t("signin.email")}
        value={data.email}
        required={true}
        onChange={(event) => onChange("email", event.target.value)}
        helperText={errors.email}
      />

       <TextField
        fullWidth
        margin="dense"
        label={t("signin.password")}
        required
        value={data.password}
        type={showPassword ? 'text' : 'password'}
        error={errors.password ? true : false}
        onChange={(event) => onChange("password", event.target.value)}
        helperText={errors && errors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />


      {/* <TextField
        margin="dense"
        fullWidth={true}
        error={errors.password ? true : false}
        label={t("signin.password")}
        value={data.password}
        type="password"
        required={true}
        onChange={(event) => onChange("password", event.target.value)}
        helperText={errors.password}
      /> */}
       <TextField
        margin="dense"
        fullWidth
        error={confirmPasswordError ? true : false}
        label={t("signin.confirmPassword")}
        type={showConfirmPassword ? 'text' : 'password'}
        required
        // value={data.confirmPassword}
        onChange={(event) => onChange("confirmPassword", event.target.value)}
        helperText={
          confirmPasswordError ? t("signin.passwordMismatch") : undefined
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* <TextField
        margin="dense"
        fullWidth={true}
        error={confirmPasswordError ? true : false}
        label={t("signin.confirmPassword")}
        type="password"
        required={true}
        onChange={(event) => onChange("confirmPassword", event.target.value)}
        helperText={
          confirmPasswordError ? t("signin.passwordMismatch") : undefined
        }
      /> */}
      {errors.server && <DialogError error={errors.server} />}
      {!user && (
        <DialogAltButtons
          heading={t("signin.alreadyRegistered")}
          actionName={t("signin.loginAction")}
          onSubmit={onClickLogin}
        />
      )}
      <DialogButtons
        onSubmit={onSubmit}
        actionName={t("signin.signupAction")}
      />
    </div>
  );
};

export default SignupComponent;

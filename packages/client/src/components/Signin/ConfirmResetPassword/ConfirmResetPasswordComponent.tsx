import {
  SigninErrors,
  TeacherConfirmResetPasswordData,
} from "@celluloid/types";
import { TextField } from "@material-ui/core";
import DialogButtons from "components/DialogButtons";
import DialogError from "components/DialogError";
import React from "react";
import { useTranslation } from "react-i18next";
import { AnyAction } from "redux";
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
interface Props {
  data: TeacherConfirmResetPasswordData;
  errors: SigninErrors;
  confirmPasswordError: boolean;
  onChange(name: string, value: string): void;
  onSubmit(): Promise<AnyAction>;

}

// eslint-disable-next-line import/no-anonymous-default-export
const ConfirmComponent = ({
  data,
  errors,
  confirmPasswordError,
  onChange,
  onSubmit,
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
      <TextField
        fullWidth={true}
        margin="dense"
        label={t("signin.login")}
        required={true}
        value={data.login}
        error={errors.email ? true : false}
        onChange={(event) => onChange("login", event.target.value)}
        helperText={errors && errors.login}
      />
      <TextField
        fullWidth={true}
        margin="dense"
        label={t("signin.code")}
        required={true}
        value={data.code}
        error={errors.code ? true : false}
        onChange={(event) => onChange("code", event.target.value)}
        helperText={errors.code ? errors.code : t("signin.codeHelper")}
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
        fullWidth={true}
        margin="dense"
        label={t("signin.password")}
        required={true}
        value={data.password}
        type="password"
        error={errors.password ? true : false}
        onChange={(event) => onChange("password", event.target.value)}
        helperText={errors && errors.password}
      /> */}
      <TextField
        fullWidth={true}
        margin="dense"
        error={confirmPasswordError ? true : false}
        label={t("signin.confirmPassword")}
        type="password"
        required={true}
        onChange={(event) => onChange("confirmPassword", event.target.value)}
        helperText={
          confirmPasswordError ? t("signin.passwordMismatch") : undefined
        }
      />
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
      {errors.server && <DialogError error={errors.server} />}
      <DialogButtons onSubmit={onSubmit} actionName={t("signin.resetAction")} />
    </div>
  );
};

export default ConfirmComponent;

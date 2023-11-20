import { UserRecord } from "@celluloid/types";
import {
  AppBar,
  Button,
  ClickAwayListener,
  createStyles,
  Grow as GrowMUI,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Theme,
  Toolbar,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { GrowProps } from "@material-ui/core/Grow";
import { closeSignin, openLogin, openSignup } from "actions/Signin";
import { getButtonLink } from "components/ButtonLink";
import SigninDialog, { SigninState } from "components/Signin";
import { Tutorial } from "components/Tutorial";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import { EmptyAction } from "types/ActionTypes";
import { AppState } from "types/StateTypes";

import SigninBar from "./components/SigninBar";

const Grow: React.FC<React.PropsWithChildren & GrowProps> = (props) => (
  <GrowMUI {...props} />
);

const styles = ({ typography, spacing, palette }: Theme) =>
  createStyles({
    root: { height: "100%" },
    grow: { flex: 1 },
    homeLink: {
      color: palette.grey[600],
      fontSize: typography.h4.fontSize,
      fontWeight: typography.h4.fontWeight,
      fontFamily: typography.h4.fontFamily,
      textTransform: "none",
      textDecoration: "none",
    },
    content: {
      paddingTop: spacing.unit * 8,
      height: "100%",
    },
    footer: {
      paddingTop: spacing.unit * 3,
      width: "100%",
      textAlign: "center",
      marginBottom: spacing.unit * 9,
    },
    copyright: {
      color: palette.grey[600],
    },
    footerLink: {
      ...typography.caption,
      color: palette.grey[600],
      display: "inline",
      textDecoration: "underline",
    },
  });

type Props = React.PropsWithChildren &
  WithStyles<typeof styles> & {
    user?: UserRecord;
    signinDialog: SigninState;
    menuAnchor?: HTMLElement;
    onOpenLangMenu(element: EventTarget): void;
    onCloseLangMenu(): void;
    onLangChange(lang: string): void;
    onClickLogin(): EmptyAction;
    onClickSignup(): EmptyAction;
    onCloseSignin(): EmptyAction;
    onClickLogout(): Promise<AnyAction>;
  };

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    signinDialog: state.signin.dialog,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onClickLogin: () => dispatch(openLogin()),
    onClickSignup: () => dispatch(openSignup()),
    onCloseSignin: () => dispatch(closeSignin()),
  };
};

const MenuComponent: React.FC<Props> = ({
  classes,
  user,
  menuAnchor,
  onOpenLangMenu,
  onCloseLangMenu,
  onLangChange,
  onClickLogin,
  onClickSignup,
  onClickLogout,
  onCloseSignin,
  signinDialog,
  children,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={classes.root}>
      <AppBar color="default">
        <Toolbar>
          <div className={classes.grow}>
            <Button component={getButtonLink("/")} className={classes.homeLink}>
            <b> {t("about.logo")} </b>
            </Button>
          </div>
          <Button
            onClick={(event) => onOpenLangMenu(event.target)}
            color="secondary"
          >
            {i18n.language.split("_")[0]}
          </Button>
          <Popper
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            transition={true}
            disablePortal={true}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={onCloseLangMenu}>
                    <MenuList>
                      <MenuItem onClick={() => onLangChange("en_US")}>
                        {`English`}
                      </MenuItem>
                      <MenuItem onClick={() => onLangChange("fr_FR")}>
                        {`Français`}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <Button component={getButtonLink("/About")}>{t("menu.about")}</Button>
          <Button component={getButtonLink("/Tutorial")}>{t("menu.tutorial")}</Button>
          <SigninBar
            user={user}
            onClickLogin={onClickLogin}
            onClickSignup={onClickSignup}
            onClickLogout={onClickLogout}
          />
        </Toolbar>
      </AppBar>
      <SigninDialog onCancel={onCloseSignin} state={signinDialog} />
      <div className={classes.content}>{children}</div>
      <div className={classes.footer}>
        <Typography variant="caption" className={classes.copyright}>
          {`© 2018 Institut Catholique de Paris`}
        </Typography>
        <NavLink to="/terms-and-conditions" className={classes.footerLink}>
          {t("menu.termsAndConditions")}
        </NavLink>
        {` - `}
        <NavLink to="/legal-notice" className={classes.footerLink}>
          {t("menu.legalNotice")}
        </NavLink>
        <Typography  variant="caption" className={classes.copyright}>
           {process.env.REACT_APP_VERSION} {process.env.REACT_APP_COMMIT}
        </Typography>
      </div>
    </div>
  );
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MenuComponent)
);

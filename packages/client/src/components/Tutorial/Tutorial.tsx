import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { SharedLayout } from "scenes/Menu";

// const logoIcp = require("./images/logo-icp.jpg");
// const logoFsm = require("./images/logo-fsm.jpg");
// const logoLp = require("./images/logo-lp.png");
// const logoBlog = require("./images/logo_espectateur.png");
// const logoHN = require("./images/logo-huma-num.jpg");


export const Tutorial: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SharedLayout>
      <div
        style={{
          padding: 48,
          maxWidth: 1024,
          margin: "0 auto",
        }}
      >
     
      </div>
    </SharedLayout>
  );
};

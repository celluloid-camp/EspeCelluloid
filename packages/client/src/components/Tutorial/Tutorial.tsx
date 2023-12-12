import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { SharedLayout } from "scenes/Menu";
import './style.css';
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
          margin: "0 auto",
          fontStyle: 'revert-layer',
        }}
      >
        <Typography align='center' variant="h2" gutterBottom={true}     style={{
                margin: '40px',
                color: '#0B9A8D',
              }}>
          Comment utiliser l'outil E-spectateur?
        </Typography>

        <Typography  align='center'  variant="h4" gutterBottom={true}>
        Avec E-spect@teur, vous pouvez être créateur de projet ou simplement participer à un projet existant.

        </Typography>
        <div className="box">
      {/* Content of the box goes here */}
    </div>
      
      </div>
    </SharedLayout>
  );
};

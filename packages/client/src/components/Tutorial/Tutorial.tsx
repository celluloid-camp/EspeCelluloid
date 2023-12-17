import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { SharedLayout } from "scenes/Menu";
import './style.css';
const join = require("./images/joinp.png");
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
                color:'#6aa84f',
              }}>
          Comment utiliser l'outil E-spectateur?
        </Typography>

        <Typography  align='center'  variant="h4" gutterBottom={true}>
        Avec E-spect@teur, vous pouvez être créateur de projet ou simplement participer à un projet existant.

        </Typography>
        <div className="spacer"></div>
        <div className="vertical-container">
         <div className="vertical-box">
            <p className="box-text">Comment rejoindre E-specta@teur ?</p>
          <div className="box-column">
              <img src={join} alt="Erasmus"/>
          </div>
           <div className="box-column">
              <img src={join} alt="Erasmus"/>
        
          </div>
          </div>


          <div className="vertical-box">Box 2</div>
          <div  className="vertical-box">Box 3</div>

        </div>
      
      </div>
    </SharedLayout>
  );
};

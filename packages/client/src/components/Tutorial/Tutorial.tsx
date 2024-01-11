import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { SharedLayout } from "scenes/Menu";
import './style.css';
const join = require("./images/newjoin.png");
const join2 = require("./images/join2.png");
const join3 = require("./images/join3.png");
const create = require("./images/create.png");
const projectcreate = require("./images/projectcreate.png");
const create2 = require("./images/create2.png");
const logo = require("./images/logo.png");
const happy= require("./images/sourire.png");
const use1= require("./images/use1.png");
const use2= require("./images/use2.png");
const use3= require("./images/use3.png");
const use4= require("./images/use4.png");
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
        <Typography align='center' variant="h2" gutterBottom={true}    style={{
                margin: '5px',
                color:'#0B9A8D',
               
              }}>
          Comment utiliser l'outil e-spectateur?  
        </Typography>
         
        <Typography align='center' variant="h6" gutterBottom={true}    style={{
                margin: '20px',
                color:'#666666',
               
              }}>
        Vous pouvez télécharger le tutorial en cliquant sur   <a href={"./images/TUTORIEL.pdf"} download={"TUTORIEL.pdf"}>Tutorial</a> 
        </Typography>
        <Typography  align='center'  variant="h4" gutterBottom={true}>
        Avec e-spect@teur, vous pouvez être créateur de projet ou simplement participer à un projet existant.

        </Typography>
        <div className="spacer"></div>
        <div className="vertical-container">
         <div className="vertical-box">
            <p className="box-text">Comment rejoindre e-specta@teur </p>
          <div className="box-column">
              <img src={join} alt="Erasmus"/>
          </div>
           <div className="box-column">
              <img src={join2} alt="Erasmus"/>
          </div>
          <div className="clear-line"></div>
         
          <div className="box-row-big">
         < img src={join3} alt="Erasmus"/>
        </div>
       
       </div>


       <div className="vertical-box">
            <p className="box-text"> Si vous souhaitez créer un projet, vous devez:</p>
          <div className="box-column">
              <img src={create} alt="Erasmus"/>
          </div>
           <div className="box-column">
              <img src={projectcreate} alt="Erasmus"/>
          </div>
          <div className="clear-line"></div>
         
          <div className="box-row">
         < img src={create2} alt="Erasmus"/>
        </div>
       
       </div>

         
       <div className="vertical-box">
            <p className="box-text"> Utiliser e-spectateur
           
            </p>
          <div className="box-column">
              <img src={use1} alt="Erasmus"/>
          </div>
           <div className="box-column">
              <img src={use2} alt="Erasmus"/>
          </div>
          <div className="clear-line"></div>
         
          <div className="box-column">
         < img src={use3} alt="Erasmus"/>
        </div>
        <div className="box-column">
         < img src={use4} alt="Erasmus"/>
        </div>
       
       </div>

        </div>
      
      </div>
    </SharedLayout>
  );
};

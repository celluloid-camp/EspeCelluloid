import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { SharedLayout } from "scenes/Menu";
import './style.css';
import { Trans } from "react-i18next";
const join = require("./images/newjoin.png");
const joinen= require("./images/en-join1.png");
const join2 = require("./images/join2.png");
const joinen2 = require("./images/en_join2.png");
const join3 = require("./images/join3.png");
const joinen3 = require("./images/en_join3.png");
const create = require("./images/create.png");
const createen = require("./images/en_create1.png");
const projectcreate = require("./images/projectcreate.png");
const projectcreateen = require("./images/en_create2.png");
const create2 = require("./images/create2.png");
const createen2 = require("./images/en_create3.png");
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
  const { t, i18n } = useTranslation();
  const fileUrl = process.env.PUBLIC_URL + '/TUTORIEL.pdf';
  const FEJoin1 = i18n.language === 'fr_FR' ? join :joinen;
  const FEJoin2 = i18n.language === 'fr_FR' ? join2 :joinen2;
  const FEJoin3 = i18n.language === 'fr_FR' ? join3 :joinen3;
  const FECreate1 = i18n.language === 'fr_FR' ? create :createen;
  const FECreate2 = i18n.language === 'fr_FR' ? projectcreate :projectcreateen;
  const FECreate3 = i18n.language === 'fr_FR' ? create2 :createen2;
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
          <Trans i18nKey={"tutorial.head"} />
        </Typography>
         
        <Typography align='center' variant="h6" gutterBottom={true}    style={{
                margin: '20px',
                color:'#666666',
               
              }}>
              <Trans i18nKey={"tutorial.download"} /><a href={fileUrl} download={"TUTORIEL.pdf"}> Tutorial</a> 
        </Typography>
        <Typography  align='center'  variant="h4" gutterBottom={true}>
            <Trans i18nKey={"tutorial.user"} />   
        </Typography>
        <div className="spacer"></div>
        <div className="vertical-container">
         <div className="vertical-box">
            <p className="box-text"> <Trans i18nKey={"tutorial.join"} /></p>
          <div className="box-column">
              <img src={FEJoin1} alt="Erasmus"/>
          </div>
           <div className="box-column">
              <img src={FEJoin2} alt="Erasmus"/>
          </div>
          <div className="clear-line"></div>
         
          <div className="box-row-big">
         < img src={FEJoin3} alt="Erasmus"/>
        </div>
       
       </div>


       <div className="vertical-box">
            <p className="box-text"> <Trans i18nKey={"tutorial.create"}/></p>
          <div className="box-column">
              <img src={FECreate1} alt="Erasmus"/>
          </div>
           <div className="box-column">
              <img src={FECreate2} alt="Erasmus"/>
          </div>
          <div className="clear-line"></div>
         
          <div className="box-row">
         < img src={FECreate3} alt="Erasmus"/>
        </div>
       
       </div>

         
       <div className="vertical-box">
            <p className="box-text"> <Trans i18nKey={"tutorial.use"}/>
           
            </p>
          <div className="box-column">
              <img src={use1} alt="Erasmus"/>
          </div>
           <div className="box-column">
              <img src={use2} alt="Erasmus"/>
          </div>
          <div className="clear-line"></div>
         
          <div className="box-column-specific">
         < img src={use3} alt="Erasmus"/>
        </div>
        <div className="box-column-specific">
         < img src={use4} alt="Erasmus"/>
        </div>
       
       </div>

        </div>
      
      </div>
    </SharedLayout>
  );
};

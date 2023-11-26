import { useState } from 'react';
import ButtonProgress from 'components/ButtonProgress';
import { getConcept } from 'scenes/Project/scenes/Video/api/Annotation';
import {
  ProjectGraphRecord,
  AnnotationData,
  AnnotationRecord,
} from '@celluloid/types';
import AnnotationService from 'services/AnnotationService';

interface Props {
  project: ProjectGraphRecord;
  buttonName: string;
}

interface AnnotationExport extends AnnotationData {
  projectTitle: string;
  username: string;
  subConcept1: string;
  subConcept2: string;
  subConcept3: string;
  relationConcept: string;
}

function XMLAnnotationExport({ project, buttonName }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const createXMLString = (annotations: AnnotationExport[]): string => {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const xmlAnnotations = annotations
      .map((annotation) => {
        const {
          text,
          emotion,
          autoDetect,
          semiAutoAnnotation,
          semiAutoAnnotationMe,
          startTime,
          stopTime,
          pause,
          username,
          ontology,
        } = annotation;

        return `
        <Annotation autoDetect="${autoDetect}" semiAutoAnnotation="${semiAutoAnnotation}" semiAutoAnnotationMe="${semiAutoAnnotationMe}" startTime="${startTime}" stopTime="${stopTime}" pasue="${pause}">
          <User>${username}</User>
          <Text>${text}</Text>
          <Emotion>${emotion}</Emotion>
          <Ontology>${ontology}</Ontology>
        </Annotation>
      `;
      })
      .join('\n');

    const xmlProject = `<Project title="${project.title}" objective="${project.objective}">\n<Annotations>\n${xmlAnnotations}\n</Annotations>\n</Project>`;

    return `${xmlHeader} ${xmlProject}`;
  };

  const exportXML = async () => {
    try {
      setIsLoading(true);

      const annotations: AnnotationRecord[] = await AnnotationService.list(
        project.id,
        {
          autoDetect: true,
        }
      );

      const annotationsXML: AnnotationExport[] = await Promise.all(
        annotations.map(async (annotation: AnnotationRecord) => {
          const response = await getConcept(annotation.id);
          const ontology = response[0];
          const superClasses = response[1];
          const relationConcept = response[2];

          const {
            text,
            emotion,
            autoDetect,
            semiAutoAnnotation,
            semiAutoAnnotationMe,
            startTime,
            stopTime,
            pause,
            user: { username },
          } = annotation;

          return {
            projectTitle: project.title,
            username,
            text,
            emotion,
            autoDetect,
            semiAutoAnnotation,
            semiAutoAnnotationMe,
            startTime,
            stopTime,
            pause,
            ontology,
            subConcept1: superClasses[0],
            subConcept2: superClasses[1],
            subConcept3: superClasses[2],
            relationConcept,
          };
        })
      );

      const xmlData = createXMLString(annotationsXML);
      const blob = new Blob([xmlData], {
        type: 'application/xml;charset=utf-8',
      });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `annotations_${project.title}.xml`;
      link.click();
      setIsLoading(false);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <ButtonProgress
      variant="contained"
      color="primary"
      size="small"
      loading={isLoading}
      onClick={() => exportXML()}
    >
      {buttonName} XML
    </ButtonProgress>
  );
}

export default XMLAnnotationExport;

import { useState } from 'react';
import ButtonProgress from 'components/ButtonProgress';
import { getConcept } from 'scenes/Project/scenes/Video/api/Annotation';
import {
  ProjectGraphRecord,
  AnnotationData,
  AnnotationRecord,
} from '@celluloid/types';
import AnnotationService from 'services/AnnotationService';
import Papa from 'papaparse';

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

function CSVAnnotationExport({ project, buttonName }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const exportCSV = async () => {
    try {
      setIsLoading(true);

      let annotations: AnnotationRecord[] = await AnnotationService.list(
        project.id,
        {
          autoDetect: true,
        }
      );

      annotations = annotations.filter(
        (annotation) => annotation.startTime !== 0 || annotation.stopTime !== 0
      );

      const annotationsCSV: AnnotationExport[] = await Promise.all(
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

      const csvData = Papa.unparse(annotationsCSV, { header: true });
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `annotations_${project.title}.csv`;
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
      onClick={() => exportCSV()}
    >
      {buttonName} CSV
    </ButtonProgress>
  );
}

export default CSVAnnotationExport;

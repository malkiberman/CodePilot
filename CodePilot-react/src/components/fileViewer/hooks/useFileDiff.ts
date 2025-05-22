import { useEffect, useState } from 'react';
import { diffLines } from 'diff';
import { fetchFileContent } from '../services/codeFileService';
import { FileDiffResult } from '../types/type';

const useFileDiff = (fileName: string, version1: string, version2: string): FileDiffResult => {
  const [diff, setDiff] = useState<any[] | null>(null);
  const [language, setLanguage] = useState<string>('text');

  useEffect(() => {
    const fetchDiff = async () => {
      const content1 = await fetchFileContent(fileName);
      const content2 = await fetchFileContent(fileName);
      const diffResult = diffLines(content1, content2);
      setDiff(diffResult);
      const ext = fileName.split('.').pop() || '';
      const langMap: Record<string, string> = {
        js: 'javascript',
        ts: 'typescript',
        py: 'python',
        java: 'java',
        cpp: 'cpp',
        html: 'html',
        css: 'css',
        json: 'json',
      };
      setLanguage(langMap[ext.toLowerCase()] || 'text');
    };
    fetchDiff();
  }, [fileName, version1, version2]);

  return { diff, language };
};

export default useFileDiff;

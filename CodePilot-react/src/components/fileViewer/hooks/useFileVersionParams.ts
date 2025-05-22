const useFileVersionParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    fileName: params.get('fileName') || '',
    version1: params.get('version1') || '',
    version2: params.get('version2') || '',
  };
};

export default useFileVersionParams;

export type EasterReportData = {
  manualVersion: string;
  reportBody: string;
};

export const parseEasterReport = (
  reportMarkdown: string,
  fallbackVersion: string
): EasterReportData => {
  const normalizedMarkdown = reportMarkdown.replace(/\r\n/g, "\n");
  const versionMatch = normalizedMarkdown.match(
    /^##\s+\[?v?(\d+\.\d+\.\d+)\]?(?:\s+[—-].*)?$/m
  );

  if (!versionMatch) {
    return {
      manualVersion: fallbackVersion,
      reportBody: normalizedMarkdown,
    };
  }

  return {
    manualVersion: `v${versionMatch[1]}`,
    reportBody: normalizedMarkdown,
  };
};

const CODE_EXTENSIONS: Record<string, string> = {
  javascript: "js",
  python: "py",
  java: "java",
  c: "c",
  go: "go",
};

export const downloadCodeSnippet = (snippet: {
  sourceCode: string;
  title: string;
  language: string;
}) => {
  const extension = CODE_EXTENSIONS[snippet.language] || "txt";
  const filename = `${snippet.title || "code-snippet"}.${extension}`;
  const blob = new Blob([snippet.sourceCode], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

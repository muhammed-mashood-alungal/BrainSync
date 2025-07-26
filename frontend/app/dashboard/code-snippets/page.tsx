import CodeSnippetListing from "./CodeListing";

export default function Resources() {
  return (
    <div className="flex-1 min-h-screen bg-[#1E1E1E] text-white px-6  ml-1">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Saved Code Snippets</h1>
        </div>

        <CodeSnippetListing />
      </div>
    </div>
  );
}

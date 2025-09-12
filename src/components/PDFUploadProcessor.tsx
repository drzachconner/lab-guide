import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.js`;
export const PDFUploadProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedContent, setParsedContent] = useState<string | null>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSelectedFile = (selectedFile: File) => {
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    const sizeOk = selectedFile.size <= 20 * 1024 * 1024; // 20MB

    if (!isPdf) {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (!sizeOk) {
      toast({
        title: "File Too Large",
        description: "Maximum allowed size is 20MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setParsedContent(null);
    toast({
      title: "PDF Selected",
      description: `Selected: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      handleSelectedFile(selectedFile);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      toast({
        title: "Processing Started",
        description: "Extracting text from the PDF and parsing catalog...",
      });

      // 1) Extract text from PDF on the client using PDF.js
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = (textContent.items as any[])
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += `\n\n--- Page ${i} ---\n` + pageText;
      }

      // 2) Send extracted text to Edge Function for AI structuring
      const { data, error } = await supabase.functions.invoke('catalog-extract-ai', {
        body: {
          text: fullText,
          source: file.name,
        },
      });

      if (error) throw error;

      const resultJson = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      setParsedContent(resultJson);

      toast({
        title: "Parsing Complete",
        description: "Catalog extracted successfully.",
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Processing Error",
        description: "Failed to parse the PDF. Please try another file or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Fullscript Lab Catalog PDF
          </CardTitle>
          <CardDescription>
            Upload your PDF file containing the Fullscript lab catalog. The file will be processed to extract all lab panel information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
              const droppedFile = e.dataTransfer.files?.[0];
              if (droppedFile) handleSelectedFile(droppedFile);
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            aria-label="Upload PDF"
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 block">
                Click to upload or drag and drop your PDF file
              </span>
              <input
                ref={inputRef}
                id="pdf-upload"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500">Maximum file size: 20MB</p>
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={processFile}
                disabled={isProcessing}
                className="ml-4"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process PDF'
                )}
              </Button>
            </div>
          )}

          {parsedContent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Status</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  {parsedContent}
                </pre>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Next Step:</strong> The file is now uploaded and ready. Please let me know in the chat that you've uploaded the file, and I'll process it to extract all the lab catalog information and integrate it into your system.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
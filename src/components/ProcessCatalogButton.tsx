import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { processAndReplaceCatalog } from '@/utils/processFullCatalogReplacement';

export const ProcessCatalogButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessCatalog = async () => {
    setIsProcessing(true);
    try {
      // Read the uploaded text file content
      const response = await fetch('/src/temp/fullscript_lab_catalog_text.txt');
      const textContent = await response.text();
      
      console.log(`Starting to process ${textContent.length} characters of catalog text...`);
      
      // Process with AI and replace catalog
      const result = await processAndReplaceCatalog(textContent);
      
      if (result.success) {
        toast.success(result.message);
        // Reload the page to show updated catalog
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to process catalog');
      }
    } catch (error) {
      console.error('Error processing catalog:', error);
      toast.error('Failed to process catalog');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handleProcessCatalog}
      disabled={isProcessing}
      className="mb-4"
    >
      {isProcessing ? 'Processing Full Catalog...' : 'Process Full Catalog Now'}
    </Button>
  );
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useConfig } from "@/hooks/useConfig";
import { useState } from "react";

interface ParsedOffer {
  operator: string;
  title: string;
  data_amount: string;
  minutes: number;
  validity_days: number;
  selling_price: number;
  original_price: number;
  region: string;
  category: string;
  whatsapp_number: string;
}

const AdminPanel = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedOffers, setParsedOffers] = useState<ParsedOffer[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { config } = useConfig();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    parseCSV(file);
  };

  const parseCSV = (file: File): Promise<ParsedOffer[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          const offers: ParsedOffer[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const values = line.split(',').map(v => v.trim());
              const offer: ParsedOffer = {
                operator: values[0] || '',
                title: values[1] || '',
                data_amount: values[2] || '',
                minutes: parseInt(values[3]) || 0,
                validity_days: parseInt(values[4]) || 0,
                selling_price: parseInt(values[5]) || 0,
                original_price: parseInt(values[6]) || 0,
                region: values[7] || '',
                category: values[8] || '',
                whatsapp_number: values[9] || config.default_whatsapp || '8801712345678'
              };
              offers.push(offer);
            }
          }
          
          setParsedOffers(offers);
          setUploadStatus(`Parsed ${offers.length} offers successfully`);
          resolve(offers);
        } catch (error) {
          setUploadStatus('Error parsing CSV file');
          reject(new Error('Failed to parse CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || file.name.endsWith('.csv')
    );
    if (csvFile) {
      handleFileSelect(csvFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadToDatabase = async () => {
    if (parsedOffers.length === 0) {
      toast({
        title: "Error",
        description: "No offers to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading to database...");
    
    try {
      const { error } = await supabase
        .from('offers')
        .insert(parsedOffers.map(offer => ({
          ...offer,
          is_active: true
        })));

      if (error) {
        throw error;
      }

      // Reset state after successful upload
      setParsedOffers([]);
      setSelectedFile(null);
      setUploadStatus("Successfully uploaded to database!");
      
      toast({
        title: "Success",
        description: `${parsedOffers.length} offers uploaded successfully!`,
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus("Upload failed!");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Upload failed",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear status message after 3 seconds
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const clearData = () => {
    setParsedOffers([]);
    setSelectedFile(null);
    setUploadStatus("");
  };

  return (
    <div className="mobile-container min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h1 className="heading-lg text-foreground">Admin Panel</h1>
        <p className="body-sm text-muted mt-1">Manage SIM offers and upload data</p>
      </div>

      <div className="p-4 space-y-6">
        {/* CSV Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Upload a CSV file containing offer data to add new offers to the database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('csvFileInput')?.click()}
            >
              <FileText className="h-12 w-12 mx-auto text-muted mb-2" />
              <p className="body-md text-foreground mb-1">
                {selectedFile ? selectedFile.name : 'Drag and drop CSV file here'}
              </p>
              <p className="body-sm text-muted">
                or click to browse files
              </p>
            </div>

            <Input
              id="csvFileInput"
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />

            <div className="flex gap-2">
              <Button
                onClick={() => document.getElementById('csvFileInput')?.click()}
                variant="outline"
                className="flex-1"
              >
                Select File
              </Button>
              <Button
                onClick={clearData}
                variant="outline"
                disabled={!selectedFile && parsedOffers.length === 0}
              >
                Clear
              </Button>
            </div>

            {/* Upload Status */}
            {uploadStatus && (
              <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                uploadStatus.includes('Error') || uploadStatus.includes('failed')
                  ? 'bg-destructive/10 border-destructive text-destructive'
                  : 'bg-success/10 border-success text-success'
              }`}>
                {uploadStatus.includes('Error') || uploadStatus.includes('failed') ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span className="body-sm">{uploadStatus}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sample Format */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Format Guide</CardTitle>
            <CardDescription>
              Use this format for your CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Sample CSV format:</strong></p>
              <code className="text-sm bg-muted p-2 rounded block mt-2">
                operator,title,data_amount,minutes,validity_days,selling_price,original_price,region,category,whatsapp_number<br />
                GP,50GB Bundle,50GB,1500,30,775,900,All Bangladesh,combo,8801712345678
              </code>
              <p className="body-sm text-muted mt-2">
                Note: WhatsApp number is optional. If not provided, the default number will be used.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Parsed Results */}
        {parsedOffers.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Parsed Offers ({parsedOffers.length})</CardTitle>
                  <CardDescription>
                    Review the offers before uploading to database
                  </CardDescription>
                </div>
                <Button
                  onClick={uploadToDatabase}
                  disabled={isUploading}
                  className="min-w-[120px]"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload to DB
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 border-b">Operator</th>
                      <th className="text-left p-2 border-b">Title</th>
                      <th className="text-left p-2 border-b">Data</th>
                      <th className="text-left p-2 border-b">Minutes</th>
                      <th className="text-left p-2 border-b">Validity</th>
                      <th className="text-left p-2 border-b">Price</th>
                      <th className="text-left p-2 border-b">Original</th>
                      <th className="text-left p-2 border-b">Region</th>
                      <th className="text-left p-2 border-b">Category</th>
                      <th className="text-left p-2 border-b">WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedOffers.map((offer, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 border-b">{offer.operator}</td>
                        <td className="p-2 border-b">{offer.title}</td>
                        <td className="p-2 border-b">{offer.data_amount}</td>
                        <td className="p-2 border-b">{offer.minutes}</td>
                        <td className="p-2 border-b">{offer.validity_days}d</td>
                        <td className="p-2 border-b">৳{offer.selling_price}</td>
                        <td className="p-2 border-b">৳{offer.original_price}</td>
                        <td className="p-2 border-b">{offer.region}</td>
                        <td className="p-2 border-b">{offer.category}</td>
                        <td className="p-2 border-b">{offer.whatsapp_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
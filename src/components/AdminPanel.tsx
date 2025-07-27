import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, XCircle, Download, Filter, X, SlidersHorizontal, AlertTriangle, Info, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useConfig } from "@/hooks/useConfig";
import { useOffers } from "@/hooks/useOffers";
import { exportToCSV } from "@/lib/utils";
import { useState } from "react";
import { CSV_HEADERS, CSV_TEMPLATE, ERROR_MESSAGES, SUCCESS_MESSAGES, OPERATORS, VALIDATION } from "@/constants";

interface ParsedOffer {
  operator: string;
  title: string;
  data_amount: string;
  minutes: number;
  validity_days: number;
  selling_price: number;
  original_price?: number;
  region?: string;
  category?: string;
  whatsapp_number?: string;
  description?: string;
}

interface ValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
}

const AdminPanel = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedOffers, setParsedOffers] = useState<ParsedOffer[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { config } = useConfig();
  const { offers } = useOffers();

  // Admin functions
  const handleExportCSV = () => {
    exportToCSV(offers, "all-offers");
    toast({
      title: SUCCESS_MESSAGES.DATA_EXPORTED,
      description: `${offers.length} offers exported to CSV`,
    });
  };

  const handleClearAllFilters = () => {
    // This would reset all filters in the main app
    toast({
      title: SUCCESS_MESSAGES.FILTERS_CLEARED,
      description: "All filters have been reset",
    });
  };

  const downloadCSVTemplate = () => {
    const csvContent = [
      CSV_TEMPLATE.headers.join(','),
      ...CSV_TEMPLATE.sampleData.map(row =>
        CSV_TEMPLATE.headers.map(header =>
          typeof row[header as keyof typeof row] === 'string'
            ? `"${row[header as keyof typeof row]}"`
            : row[header as keyof typeof row]
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sim-offers-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "CSV template downloaded successfully",
    });
  };

  const validateCSVData = (data: any[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    data.forEach((row, index) => {
      // Check required fields
      CSV_HEADERS.REQUIRED.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push({
            row: index + 1,
            field,
            value: row[field],
            message: `${field} is required`
          });
        }
      });

      // Validate operator
      if (row.operator && !Object.values(OPERATORS).includes(row.operator)) {
        errors.push({
          row: index + 1,
          field: 'operator',
          value: row.operator,
          message: `Invalid operator. Must be one of: ${Object.values(OPERATORS).join(', ')}`
        });
      }

      // Validate price
      if (row.selling_price && (isNaN(row.selling_price) || row.selling_price < VALIDATION.MIN_PRICE || row.selling_price > VALIDATION.MAX_PRICE)) {
        errors.push({
          row: index + 1,
          field: 'selling_price',
          value: row.selling_price,
          message: `Price must be between ${VALIDATION.MIN_PRICE} and ${VALIDATION.MAX_PRICE}`
        });
      }

      // Validate validity
      if (row.validity_days && (isNaN(row.validity_days) || row.validity_days < VALIDATION.MIN_VALIDITY || row.validity_days > VALIDATION.MAX_VALIDITY)) {
        errors.push({
          row: index + 1,
          field: 'validity_days',
          value: row.validity_days,
          message: `Validity must be between ${VALIDATION.MIN_VALIDITY} and ${VALIDATION.MAX_VALIDITY} days`
        });
      }

      // Validate title length
      if (row.title && row.title.length > VALIDATION.MAX_TITLE_LENGTH) {
        errors.push({
          row: index + 1,
          field: 'title',
          value: row.title,
          message: `Title must be less than ${VALIDATION.MAX_TITLE_LENGTH} characters`
        });
      }
    });

    return errors;
  };

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
          const lines = csv.split('\n').filter(line => line.trim());

          if (lines.length < 2) {
            throw new Error('CSV file must contain at least a header row and one data row');
          }

          // Parse headers
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          setCsvHeaders(headers);

          // Check for required headers
          const missingHeaders = CSV_HEADERS.REQUIRED.filter(required =>
            !headers.some(header => header.toLowerCase() === required.toLowerCase())
          );

          if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
          }

          // Parse data rows
          const rawData: any[] = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
              const rowData: any = {};

              headers.forEach((header, index) => {
                rowData[header.toLowerCase()] = values[index] || '';
              });

              rawData.push(rowData);
            }
          }

          // Validate data
          const errors = validateCSVData(rawData);
          setValidationErrors(errors);

          if (errors.length > 0) {
            setUploadStatus(`Found ${errors.length} validation errors. Please fix them before uploading.`);
          }

          // Convert to ParsedOffer format
          const offers: ParsedOffer[] = rawData.map(row => ({
            operator: row.operator || '',
            title: row.title || '',
            data_amount: row.data_amount || '',
            minutes: parseInt(row.minutes) || 0,
            validity_days: parseInt(row.validity_days) || 0,
            selling_price: parseFloat(row.selling_price) || 0,
            original_price: parseFloat(row.original_price) || undefined,
            region: row.region || 'All Bangladesh',
            category: row.category || 'data',
            whatsapp_number: row.whatsapp_number || config.default_whatsapp || '+8801712345678',
            description: row.description || ''
          }));

          setParsedOffers(offers);

          if (errors.length === 0) {
            setUploadStatus(`✅ Parsed ${offers.length} offers successfully - Ready to upload!`);
          }

          resolve(offers);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.CSV_INVALID_FORMAT;
          setUploadStatus(`❌ ${errorMessage}`);
          setValidationErrors([]);
          setParsedOffers([]);
          reject(error);
        }
      };
      reader.onerror = () => {
        const error = new Error(ERROR_MESSAGES.CSV_INVALID_FORMAT);
        setUploadStatus(`❌ ${error.message}`);
        reject(error);
      };
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
        {/* Admin Controls Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Admin Controls
            </CardTitle>
            <CardDescription>
              Manage offers, export data, and control filters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Show Filters
              </Button>

              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export CSV
              </Button>

              <Button
                onClick={handleClearAllFilters}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X size={16} />
                Clear All Filters
              </Button>
            </div>

            {/* Advanced Filters Section */}
            {showAdvancedFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Advanced Filter Controls</h4>
                <p className="text-sm text-gray-600">
                  Advanced filtering options will be implemented here for admin use.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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
            {/* CSV Template Download */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Need help with CSV format?
                <Button
                  variant="link"
                  className="p-0 h-auto ml-1 text-blue-600"
                  onClick={downloadCSVTemplate}
                >
                  Download CSV Template
                </Button>
              </AlertDescription>
            </Alert>

            {/* Required Headers Info */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Required CSV Headers:</h4>
              <div className="flex flex-wrap gap-1">
                {CSV_HEADERS.REQUIRED.map(header => (
                  <Badge key={header} variant="secondary" className="text-xs">
                    {header}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Optional: {CSV_HEADERS.OPTIONAL.join(', ')}
              </p>
            </div>

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
                uploadStatus.includes('❌') || uploadStatus.includes('Error') || uploadStatus.includes('failed')
                  ? 'bg-destructive/10 border-destructive text-destructive'
                  : uploadStatus.includes('✅')
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }`}>
                {uploadStatus.includes('❌') || uploadStatus.includes('Error') || uploadStatus.includes('failed') ? (
                  <XCircle className="h-4 w-4" />
                ) : uploadStatus.includes('✅') ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span className="body-sm">{uploadStatus}</span>
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Found {validationErrors.length} validation errors:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {validationErrors.slice(0, 10).map((error, index) => (
                        <div key={index} className="text-xs bg-red-50 p-2 rounded border">
                          <strong>Row {error.row}:</strong> {error.message}
                          <span className="text-gray-600"> (Field: {error.field}, Value: "{error.value}")</span>
                        </div>
                      ))}
                      {validationErrors.length > 10 && (
                        <p className="text-xs text-gray-600">... and {validationErrors.length - 10} more errors</p>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* CSV Headers Info */}
            {csvHeaders.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">Detected CSV Headers:</h4>
                <div className="flex flex-wrap gap-1">
                  {csvHeaders.map(header => (
                    <Badge
                      key={header}
                      variant={CSV_HEADERS.REQUIRED.includes(header.toLowerCase()) ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {header}
                    </Badge>
                  ))}
                </div>
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
                  <CardTitle className="flex items-center gap-2">
                    Parsed Offers ({parsedOffers.length})
                    {validationErrors.length === 0 && parsedOffers.length > 0 && (
                      <Badge variant="default" className="bg-green-600">
                        ✓ Valid
                      </Badge>
                    )}
                    {validationErrors.length > 0 && (
                      <Badge variant="destructive">
                        {validationErrors.length} Errors
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Review the offers before uploading to database
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                  <Button
                    onClick={uploadToDatabase}
                    disabled={isUploading || validationErrors.length > 0}
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
                  <Button
                    onClick={() => {
                      setParsedOffers([]);
                      setValidationErrors([]);
                      setCsvHeaders([]);
                      setSelectedFile(null);
                      setUploadStatus('');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showPreview && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 border font-medium">Operator</th>
                        <th className="text-left p-3 border font-medium">Title</th>
                        <th className="text-left p-3 border font-medium">Data</th>
                        <th className="text-left p-3 border font-medium">Minutes</th>
                        <th className="text-left p-3 border font-medium">Validity</th>
                        <th className="text-left p-3 border font-medium">Price</th>
                        <th className="text-left p-3 border font-medium">Original</th>
                        <th className="text-left p-3 border font-medium">Region</th>
                        <th className="text-left p-3 border font-medium">Category</th>
                        <th className="text-left p-3 border font-medium">WhatsApp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedOffers.slice(0, 10).map((offer, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 border">
                            <Badge variant="outline" className={`${OPERATOR_COLORS[offer.operator as keyof typeof OPERATOR_COLORS] || 'bg-gray-500'} text-white border-0`}>
                              {offer.operator}
                            </Badge>
                          </td>
                          <td className="p-3 border max-w-[200px] truncate" title={offer.title}>
                            {offer.title}
                          </td>
                          <td className="p-3 border font-medium">{offer.data_amount}</td>
                          <td className="p-3 border">{offer.minutes || '-'}</td>
                          <td className="p-3 border">{offer.validity_days}d</td>
                          <td className="p-3 border font-bold text-green-600">৳{offer.selling_price}</td>
                          <td className="p-3 border text-gray-500">
                            {offer.original_price ? `৳${offer.original_price}` : '-'}
                          </td>
                          <td className="p-3 border text-sm">{offer.region || 'All Bangladesh'}</td>
                          <td className="p-3 border">
                            <Badge variant="secondary" className="text-xs">
                              {offer.category || 'data'}
                            </Badge>
                          </td>
                          <td className="p-3 border text-xs font-mono">
                            {offer.whatsapp_number || 'Default'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedOffers.length > 10 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        Showing first 10 offers. Total: {parsedOffers.length} offers will be uploaded.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!showPreview && parsedOffers.length > 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">
                    {parsedOffers.length} offers ready for upload
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                    className="text-blue-600"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
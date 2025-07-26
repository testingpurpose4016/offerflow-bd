import { useState, useRef } from "react";
import { Upload, Download, FileText, Trash2, Plus } from "lucide-react";

interface ParsedOffer {
  operator: string;
  title: string;
  data_amount: string;
  minutes: number;
  selling_price: number;
  original_price?: number;
  category: string;
  region?: string;
}

const AdminPanel = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedOffers, setParsedOffers] = useState<ParsedOffer[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleCsvFormat = `operator,title,data_amount,minutes,selling_price,original_price,category,region
GP,50GB + 1500 Minutes Bundle,50GB,1500,775,900,combo,All Bangladesh
Robi,10GB Data Pack,10GB,0,240,300,internet,All Bangladesh
Banglalink,150GB Data Pack,150GB,0,640,750,internet,Dhaka/Chittagong`;

  const handleFileSelect = (file: File) => {
    setCsvFile(file);
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const offers: ParsedOffer[] = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            return {
              operator: values[0] || '',
              title: values[1] || '',
              data_amount: values[2] || '',
              minutes: parseInt(values[3]) || 0,
              selling_price: parseInt(values[4]) || 0,
              original_price: values[5] ? parseInt(values[5]) : undefined,
              category: values[6] || 'internet',
              region: values[7] || 'All Bangladesh'
            };
          });

        setParsedOffers(offers);
        setUploadStatus(`Parsed ${offers.length} offers successfully`);
      } catch (error) {
        setUploadStatus('Error parsing CSV file');
        console.error('CSV parsing error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
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
    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus(`Successfully uploaded ${parsedOffers.length} offers to database!`);
      setParsedOffers([]);
      setCsvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadStatus('Error uploading to database');
    } finally {
      setIsUploading(false);
    }
  };

  const clearData = () => {
    setParsedOffers([]);
    setCsvFile(null);
    setUploadStatus("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="admin-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel - SIM Offer Manager</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total Active Offers: 24</span>
              <span>Last Updated: 2 hours ago</span>
            </div>
          </div>
        </div>

        {/* CSV Upload Section */}
        <div className="admin-card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload size={20} />
            Upload CSV File
          </h2>

          <div
            className="upload-zone mb-6"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {csvFile ? csvFile.name : "Drag CSV file here or click to browse"}
            </h3>
            <p className="text-gray-500">Support for .csv files up to 10MB</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Select File
            </button>
            
            <button
              onClick={clearData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Trash2 size={16} />
              Clear
            </button>
          </div>

          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              uploadStatus.includes('Error') 
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Sample CSV Format */}
        <div className="admin-card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Download size={18} />
            Sample CSV Format
          </h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto">
            {sampleCsvFormat}
          </pre>
        </div>

        {/* Parsed Results */}
        {parsedOffers.length > 0 && (
          <div className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Parsed Results ({parsedOffers.length} offers)
              </h3>
              <button
                onClick={uploadToDatabase}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Upload size={16} />
                )}
                {isUploading ? 'Uploading...' : 'Upload to Database'}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {parsedOffers.map((offer, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {offer.operator}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {offer.category}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{offer.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {offer.data_amount}
                    {offer.minutes > 0 && ` + ${offer.minutes} min`}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      {offer.original_price && (
                        <span className="text-xs text-gray-500 line-through">৳{offer.original_price}</span>
                      )}
                      <span className="text-sm font-bold text-green-600 ml-1">৳{offer.selling_price}</span>
                    </div>
                    <span className="text-xs text-gray-500">{offer.region}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
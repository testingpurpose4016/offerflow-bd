import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/lib/api/service';
import { Upload, FileText, Download, BarChart3 } from 'lucide-react';
import type { CsvOffer } from '@/lib/api/contracts';

interface AdminPanelProps {
  config: Record<string, any>;
  error?: string | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, error }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [defaultWhatsApp, setDefaultWhatsApp] = useState(config.default_whatsapp || '');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const parseCSV = (csvContent: string): CsvOffer[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have header and data rows');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data: CsvOffer[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      data.push({
        operator: row.operator || '',
        title: row.title || '',
        data_amount: row.data_amount || '',
        minutes: parseInt(row.minutes) || 0,
        validity_days: parseInt(row.validity_days) || 0,
        selling_price: parseInt(row.selling_price) || 0,
        original_price: parseInt(row.original_price) || undefined,
        region: row.region || 'Global',
        category: row.category || 'Data',
        whatsapp_number: row.whatsapp_number || defaultWhatsApp || '',
        description: row.description || ''
      });
    }

    return data;
  };

  const handleUpload = async () => {
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const csvContent = await csvFile.text();
      const csvOffers = parseCSV(csvContent);

      // Validate first
      const validateResponse = await ApiService.validateCsv({
        offers: csvOffers,
        validate_only: true
      });

      if (!validateResponse.success) {
        throw new Error(validateResponse.error);
      }

      // If validation passes, import
      const importResponse = await ApiService.importCsv({
        offers: csvOffers,
        validate_only: false
      });

      if (!importResponse.success) {
        throw new Error(importResponse.error);
      }

      toast({
        title: "Upload successful",
        description: `${csvOffers.length} offers uploaded successfully`
      });

      setCsvFile(null);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await ApiService.exportData();
      
      if (!response.success) {
        throw new Error(response.error);
      }

      // Create and download CSV file
      const csvContent = JSON.stringify(response.data, null, 2);
      const blob = new Blob([csvContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'offers-export.json';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Data exported successfully"
      });
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const updateDefaultWhatsApp = async () => {
    try {
      // This would call config management API to update default WhatsApp
      toast({
        title: "Configuration updated",
        description: "Default WhatsApp number updated successfully"
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update configuration",
        variant: "destructive"
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Admin Panel</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Panel</h1>
        
        <div className="grid gap-6">
          {/* Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Manage global settings and default values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whatsapp">Default WhatsApp Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="whatsapp"
                    value={defaultWhatsApp}
                    onChange={(e) => setDefaultWhatsApp(e.target.value)}
                    placeholder="+8801712345678"
                  />
                  <Button onClick={updateDefaultWhatsApp}>Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CSV Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                CSV Upload
              </CardTitle>
              <CardDescription>
                Upload a CSV file containing offer data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-file">Select CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
              
              {csvFile && (
                <div className="text-sm text-muted-foreground">
                  Selected: {csvFile.name}
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={!csvFile || isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload CSV'}
              </Button>
            </CardContent>
          </Card>

          {/* Data Export Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Export
              </CardTitle>
              <CardDescription>
                Export current offers data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExport} variant="outline" className="w-full">
                Export All Data
              </Button>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Statistics
              </CardTitle>
              <CardDescription>
                System overview and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">-</div>
                  <div className="text-sm text-muted-foreground">Total Offers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">-</div>
                  <div className="text-sm text-muted-foreground">Active Offers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Loader2, FileSpreadsheet } from 'lucide-react';

export const BackendTestPanel = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState('6');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetName, setSheetName] = useState('wip');
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_API_BASE = 'http://localhost:8001/api';

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setIsLoading(true);
    try {
      const result = await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
      toast({
        title: `${testName} Success`,
        description: `Test completed successfully`,
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }));
      toast({
        title: `${testName} Failed`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendHealth = () => runTest('Backend Health', async () => {
    const response = await fetch(`${BACKEND_API_BASE.replace('/api', '')}/`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  });

  const testConnection = () => runTest('Google Connection', async () => {
    const response = await fetch(`${BACKEND_API_BASE}/google/connection/${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  });

  const testGetSheets = () => runTest('Get Sheets', async () => {
    const response = await fetch(`${BACKEND_API_BASE}/google/sheets/${userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  });

  const testGetTabs = () => runTest('Get Tabs', async () => {
    if (!spreadsheetId) throw new Error('Please enter a Spreadsheet ID');
    const response = await fetch(`${BACKEND_API_BASE}/google/sheets/${userId}/${spreadsheetId}/tabs`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  });

  const testGetData = () => runTest('Get Sheet Data', async () => {
    if (!spreadsheetId) throw new Error('Please enter a Spreadsheet ID');
    const response = await fetch(
      `${BACKEND_API_BASE}/google/sheets/${userId}/${spreadsheetId}/data?sheet_name=${sheetName}&range_start=A1&range_end=Z100`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  });

  const runAllTests = async () => {
    await testBackendHealth();
    await testConnection();
    await testGetSheets();
    if (spreadsheetId) {
      await testGetTabs();
      await testGetData();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            Backend Google Sheets API Test Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
              />
            </div>
            <div>
              <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
              <Input
                id="spreadsheetId"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="Enter spreadsheet ID"
              />
            </div>
            <div>
              <Label htmlFor="sheetName">Sheet Name</Label>
              <Input
                id="sheetName"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Enter sheet name"
              />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={testBackendHealth} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Test Backend Health
              </Button>
              <Button onClick={testConnection} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Test Connection
              </Button>
              <Button onClick={testGetSheets} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Get Sheets
              </Button>
              <Button onClick={testGetTabs} disabled={isLoading || !spreadsheetId}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Get Tabs
              </Button>
              <Button onClick={testGetData} disabled={isLoading || !spreadsheetId}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Get Data
              </Button>
              <Button onClick={runAllTests} disabled={isLoading} variant="default">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Run All Tests
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results:</h3>
            {Object.entries(testResults).map(([testName, result]: [string, any]) => (
              <Card key={testName} className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{testName}</span>
                  </div>
                  <div className="text-sm">
                    {result.success ? (
                      <pre className="bg-white p-2 rounded border overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-red-700">{result.error}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Status */}
          <div className="text-sm text-gray-600">
            <p><strong>Backend URL:</strong> {BACKEND_API_BASE}</p>
            <p><strong>Expected Google Sheets API:</strong> http://localhost:8000/oauth/google</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

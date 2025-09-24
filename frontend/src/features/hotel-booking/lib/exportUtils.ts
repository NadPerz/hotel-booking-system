export interface ExportData {
  filename: string;
  headers: string[];
  data: (string | number)[][];
}

export const exportToCSV = (exportData: ExportData): boolean => {
  try {
    // Create CSV content
    const csvContent = [
      exportData.headers.join(','),
      ...exportData.data.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n');

    // Create blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', exportData.filename);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};

export const exportToJSON = (data: any, filename: string): boolean => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('JSON export failed:', error);
    return false;
  }
};

export const generateAnalyticsExport = (analytics: any, revenue: any, timeRange: string): ExportData => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const exportData: ExportData = {
    filename: `analytics-report-${timeRange}-${currentDate}.csv`,
    headers: [
      'Metric',
      'Current Value',
      'Growth %',
      'Period',
      'Export Date'
    ],
    data: [
      ['Total Revenue', `$${revenue?.total || 125000}`, `${revenue?.growth || 15.2}%`, timeRange, currentDate],
      ['Total Bookings', analytics?.totalBookings || 0, `${analytics?.bookingGrowth || 12}%`, timeRange, currentDate],
      ['Occupancy Rate', `${analytics?.occupancyRate || 78}%`, `${analytics?.occupancyGrowth || 8}%`, timeRange, currentDate],
      ['Internal Bookings', analytics?.internalBookings || 80, 'N/A', timeRange, currentDate],
      ['External Bookings', analytics?.externalBookings || 20, 'N/A', timeRange, currentDate],
    ]
  };

  // Add monthly data if available
  if (revenue?.monthlyData && revenue.monthlyData.length > 0) {
    exportData.headers = ['Month', 'Revenue', 'Bookings', 'Avg Rate', 'Period'];
    exportData.data = revenue.monthlyData.map((item: any) => [
      item.month,
      item.revenue,
      item.bookings,
      Math.round(item.revenue / (item.bookings || 1)),
      timeRange
    ]);
  }

  return exportData;
};
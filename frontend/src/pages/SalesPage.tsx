// pages/SalesPage.tsx
import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Users, 
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Target,
  Zap
} from 'lucide-react';
import { useTotalSales, useDailySales, useSalesByTable } from '../hooks/use-sales';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';

const SalesPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [viewMode, setViewMode] = useState<'daily' | 'table'>('daily');

  const { totalSales, loading: loadingTotal, error: errorTotal } = useTotalSales(dateRange.start, dateRange.end);
  const { dailySales, loading: loadingDaily, error: errorDaily } = useDailySales(dateRange.start, dateRange.end);
  const { salesByTable, loading: loadingTable, error: errorTable } = useSalesByTable();

  // Calculate insights
  const averageDaily = dailySales.length > 0 
    ? dailySales.reduce((sum, day) => sum + day.totalSales, 0) / dailySales.length 
    : 0;

  const bestDay = dailySales.length > 0 
    ? Math.max(...dailySales.map(d => d.totalSales))
    : 0;

  const worstDay = dailySales.length > 0 
    ? Math.min(...dailySales.map(d => d.totalSales))
    : 0;

  const bestTable = salesByTable.length > 0
    ? salesByTable.reduce((prev, current) => 
        (prev.totalSales > current.totalSales) ? prev : current
      )
    : null;

  const getDayOfWeek = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getGrowthIndicator = (current: number, previous: number) => {
    if (previous === 0) return { trend: 'neutral', percentage: 0 };
    const growth = ((current - previous) / previous) * 100;
    return {
      trend: growth > 0 ? 'up' : growth < 0 ? 'down' : 'neutral',
      percentage: Math.abs(growth)
    };
  };

  if (errorTotal || errorDaily || errorTable) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg border p-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading sales data</h3>
          <p className="text-gray-600 mb-4 text-sm">
            {errorTotal || errorDaily || errorTable}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Analytics </h1>
        <p className="text-gray-600 text-lg mt-1">Track performance and revenue insights</p>
      </div>

      {/* Date Range Selector */}
      <Card className="mb-8 bg-white shadow-sm border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Date Range:</span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="border-gray-200 focus:border-blue-500"
                />
                <span className="text-gray-500 font-medium">to</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'daily' ? 'default' : 'outline'}
                onClick={() => setViewMode('daily')}
                className="text-sm"
              >
                Daily View
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
                className="text-sm"
              >
                Table View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">
                  {loadingTotal ? '...' : `$${totalSales?.totalSales?.toFixed(2) || '0.00'}`}
                </p>
                <p className="text-green-100 text-xs mt-1">Selected period</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Daily Average</p>
                <p className="text-3xl font-bold">
                  {loadingDaily ? '...' : `$${averageDaily.toFixed(2)}`}
                </p>
                <p className="text-blue-100 text-xs mt-1">Per day average</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Best Day</p>
                <p className="text-3xl font-bold">
                  {loadingDaily ? '...' : `$${bestDay.toFixed(2)}`}
                </p>
                <p className="text-orange-100 text-xs mt-1">Peak performance</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Top Table</p>
                <p className="text-3xl font-bold">
                  {loadingTable ? '...' : bestTable ? `Table ${bestTable.tableNumber}` : 'N/A'}
                </p>
                <p className="text-purple-100 text-xs mt-1">Best performer</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart/Data */}
        <Card className="lg:col-span-2 bg-white shadow-sm border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {viewMode === 'daily' ? 'Daily Sales Trend' : 'Table Performance'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Last {dailySales.length} days</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'daily' ? (
              <div className="space-y-3">
                {loadingDaily ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))
                ) : dailySales.length > 0 ? (
                  <>
                    {/* Visual Bar Chart */}
                    <div className="mb-6">
                      <div className="flex items-end justify-between h-32 bg-gradient-to-t from-gray-50 to-transparent rounded-lg p-4 gap-2">
                        {dailySales.slice(-7).map((day, index) => {
                          const height = (day.totalSales / bestDay) * 100;
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                              <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                                style={{ height: `${height}%`, minHeight: '4px' }}
                                title={`$${day.totalSales.toFixed(2)}`}
                              />
                              <span className="text-xs text-gray-600 font-medium">
                                {getDayOfWeek(day.date)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed List */}
                    {dailySales.map((day, index) => {
                      const previousDay = dailySales[index - 1];
                      const growth = previousDay ? getGrowthIndicator(day.totalSales, previousDay.totalSales) : null;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {new Date(day.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">${day.totalSales.toFixed(2)}</p>
                            {growth && (
                              <div className={`flex items-center gap-1 text-xs ${
                                growth.trend === 'up' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {growth.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                <span>{growth.percentage.toFixed(1)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No sales data available for the selected period</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {loadingTable ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ))
                ) : salesByTable.length > 0 ? (
                  salesByTable.map((table, index) => {
                    const percentage = bestTable ? (table.totalSales / bestTable.totalSales) * 100 : 0;
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-semibold text-gray-900">Table {table.tableNumber}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg text-gray-900">${table.totalSales.toFixed(2)}</span>
                            {index === 0 && (
                              <Badge className="ml-2 bg-purple-100 text-purple-700">Best</Badge>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No table sales data available</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Revenue Goal */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">Revenue Target</span>
                </div>
                <div className="text-2xl font-bold text-green-900 mb-1">
                  ${((totalSales?.totalSales || 0) * 1.2).toFixed(0)}
                </div>
                <p className="text-sm text-green-700">Suggested monthly goal</p>
              </div>

              {/* Performance Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Best vs Worst Day</span>
                  <span className="font-bold text-blue-900">
                    {worstDay > 0 ? `${((bestDay / worstDay) * 100).toFixed(0)}%` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-orange-800">Days Above Average</span>
                  <span className="font-bold text-orange-900">
                    {dailySales.filter(d => d.totalSales > averageDaily).length}/{dailySales.length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Peak Performance</span>
                  <span className="font-bold text-purple-900">
                    {bestTable ? `Table ${bestTable.tableNumber}` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    Export Sales Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    View Detailed Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    Set Revenue Goals
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
};

export default SalesPage;
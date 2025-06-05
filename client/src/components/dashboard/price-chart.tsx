import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

declare global {
  interface Window {
    Chart: any;
  }
}

export function PriceChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      initializeChart();
    };
    document.head.appendChild(script);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const initializeChart = () => {
    if (!chartRef.current || !window.Chart) return;

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        datasets: [
          {
            label: 'ETH Price',
            data: [2380, 2420, 2450, 2431, 2465, 2440, 2455],
            borderColor: 'hsl(217, 91%, 60%)', // primary
            backgroundColor: 'hsla(217, 91%, 60%, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'hsl(217, 91%, 60%)',
            pointBorderColor: 'hsl(217, 91%, 60%)',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'AI Prediction',
            data: [2390, 2425, 2455, 2440, 2470, 2445, 2465],
            borderColor: 'hsl(142, 71%, 45%)', // chart-1
            backgroundColor: 'hsla(142, 71%, 45%, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointBackgroundColor: 'hsl(142, 71%, 45%)',
            pointBorderColor: 'hsl(142, 71%, 45%)',
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'hsl(210, 40%, 98%)', // foreground
              font: {
                family: 'Inter, system-ui, sans-serif'
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'hsl(217, 10%, 65%)' // muted-foreground
            },
            grid: {
              color: 'hsl(215, 28%, 17%)' // border
            }
          },
          y: {
            ticks: {
              color: 'hsl(217, 10%, 65%)', // muted-foreground
              callback: function(value: any) {
                return '$' + value;
              }
            },
            grid: {
              color: 'hsl(215, 28%, 17%)' // border
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    // Simulate real-time updates
    const updateChart = () => {
      if (!chartInstance.current) return;
      
      const chart = chartInstance.current;
      const data = chart.data;
      
      // Add new data point
      const lastActualPrice = data.datasets[0].data[data.datasets[0].data.length - 1];
      const lastPredictionPrice = data.datasets[1].data[data.datasets[1].data.length - 1];
      
      const newActualPrice = lastActualPrice + (Math.random() - 0.5) * 20;
      const newPredictionPrice = lastPredictionPrice + (Math.random() - 0.5) * 15;
      
      data.datasets[0].data.push(newActualPrice);
      data.datasets[1].data.push(newPredictionPrice);
      
      if (data.datasets[0].data.length > 20) {
        data.datasets[0].data.shift();
        data.datasets[1].data.shift();
        data.labels.shift();
      }
      
      const now = new Date();
      data.labels.push(now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'));
      
      chart.update('none');
    };

    const interval = setInterval(updateChart, 5000);
    
    return () => clearInterval(interval);
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">ETH/USD Price & AI Prediction</CardTitle>
            <p className="text-sm text-muted-foreground">Real-time price with LSTM predictions</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="4h">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="4h">4H</SelectItem>
                <SelectItem value="1d">1D</SelectItem>
                <SelectItem value="1w">1W</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 chart-container">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Next Hour</p>
            <p className="text-lg font-semibold text-chart-1">+2.3%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Next 4 Hours</p>
            <p className="text-lg font-semibold text-chart-3">+0.8%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Next 24 Hours</p>
            <p className="text-lg font-semibold text-chart-4">-1.2%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

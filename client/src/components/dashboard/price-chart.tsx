import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

declare global {
  interface Window {
    Chart: any;
  }
}

// Keep track of script loading state globally
let chartScriptLoaded = false;
let chartScriptLoading = false;

export function PriceChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadChartScript = () => {
      if (chartScriptLoaded) {
        setIsChartLoaded(true);
        return;
      }

      if (chartScriptLoading) {
        return;
      }

      chartScriptLoading = true;
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.async = true;
      script.onload = () => {
        chartScriptLoaded = true;
        chartScriptLoading = false;
        setIsChartLoaded(true);
      };
      script.onerror = () => {
        chartScriptLoading = false;
        console.error("Failed to load Chart.js");
      };
      document.head.appendChild(script);
    };

    loadChartScript();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isChartLoaded && chartRef.current && !isInitialized) {
      initializeChart();
      setIsInitialized(true);
    }
  }, [isChartLoaded, isInitialized]);

  const initializeChart = () => {
    if (!chartRef.current || !window.Chart) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    try {
      // Create new chart
      chartInstance.current = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Price",
              data: [],
              borderColor: "rgb(34, 197, 94)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "AI Prediction",
              data: [],
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderDash: [5, 5],
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
          },
        },
      });

      // Initial data update
      updateChart();

      // Set up periodic updates
      const interval = setInterval(updateChart, 5000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error initializing chart:", error);
    }
  };

  const updateChart = () => {
    if (!chartInstance.current) return;

    try {
      // Generate mock data
      const now = new Date();
      const labels = Array.from({ length: 24 }, (_, i) => {
        const time = new Date(now.getTime() - (23 - i) * 5 * 60000);
        return time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      });

      const priceData = Array.from(
        { length: 24 },
        () => Math.random() * 100 + 2000
      );

      const predictionData = priceData.map(
        (price) => price + (Math.random() * 40 - 20)
      );

      // Update chart data
      chartInstance.current.data.labels = labels;
      chartInstance.current.data.datasets[0].data = priceData;
      chartInstance.current.data.datasets[1].data = predictionData;
      chartInstance.current.update();
    } catch (error) {
      console.error("Error updating chart:", error);
    }
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              ETH/USD Price & AI Prediction
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time price with LSTM predictions
            </p>
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
            <Button variant="outline" size="sm" onClick={updateChart}>
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

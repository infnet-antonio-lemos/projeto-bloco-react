import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './PriceChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ symbol, currentInterval, intervals, data }) => {
  
  if (!data || data.length === 0) {
    return (
      <div className="price-chart-container">
        <p className="no-data-text">Aguardando dados de mercado para desenhar o gráfico...</p>
      </div>
    );
  }

  // =========================================================
  // 1. ADAPTAÇÃO AO INTERVALO (Formatando o texto do Eixo X)
  // =========================================================
  const chartLabels = data.map(item => {
    const rawTimestamp = Array.isArray(item) ? item[0] : item.time;
    const date = new Date(Number(rawTimestamp));
    const intervalStr = String(currentInterval);

    // Busca o objeto/string do intervalo sem lowercase para evitar confusão entre '1m' e '1M'
    const safeIntervals = intervals || [];
    const intervalObj = safeIntervals.find(i =>
      typeof i === 'object' ? String(i.value) === intervalStr : String(i) === intervalStr
    );

    // Para Bybit (objetos com .label) usa o label; para Binance usa o próprio valor
    const label = typeof intervalObj === 'object' && intervalObj?.label
      ? intervalObj.label
      : intervalStr;

    // Adapta o texto usando label case-sensitivo: '1m' termina em 'm', '1M' não
    if (label.endsWith('m')) {
      // Intervalos de minutos: mostra só hora
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (label.endsWith('h')) {
      // Intervalos de horas: mostra data + hora
      return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      // Diário, semanal, mensal: mostra só data
      return date.toLocaleDateString('pt-BR');
    }
  });

  const chartPrices = data.map(item => {
    const price = Array.isArray(item) ? item[4] : item.close;
    return parseFloat(price);
  });

  // =========================================================
  // 2. ADAPTAÇÃO AO LIMITE (Calculando a densidade do Eixo X)
  // =========================================================
  const totalPoints = data.length; 
  let dynamicMaxTicks = 6;

  if (totalPoints <= 15) {
    dynamicMaxTicks = totalPoints; 
  } else if (totalPoints <= 50) {
    dynamicMaxTicks = 10; 
  } else {
    dynamicMaxTicks = 15; 
  }

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: `Preço - ${symbol}`,
        data: chartPrices,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 2,
        pointRadius: 0, 
        pointHoverRadius: 6,
        pointBackgroundColor: '#00d4ff',
        fill: true,
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e2f',
        titleColor: '#a0a0b0',
        bodyColor: '#00d4ff',
        borderColor: '#333',
        borderWidth: 1,
        displayColors: false,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          color: '#a0a0b0', 
          maxTicksLimit: dynamicMaxTicks, 
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true
        }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#a0a0b0' }
      }
    }
  };

  return (
    <div className="price-chart-container">
      <div className="price-chart-header">
        <h4>Análise Gráfica: {symbol}</h4>
        <span className="price-chart-badge">Intervalo: {currentInterval}</span>
      </div>
      
      <div className="price-chart-canvas-placeholder chart-active">
        <Line key={currentInterval} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PriceChart;
import React from "react";
import "./PriceChart.css";

const PriceChart = ({ symbol, interval, data}) => {

    return (
        <div className="price-chart-container">
            <div className="price-chart-header">
                <h4>Análise Gráfico: {symbol}</h4>
            </div>
            <div className="price-chart-canvas-placeholder">
                <p>O gráfico será gerado aqui</p>
                <p style={{ fontSize: '0.8rem', color: '#666'}}>Total de registros hist´ricos recebidos: {data.length}</p>
            </div>
        </div>
    )
}

export default PriceChart;
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import csvData from '../assets/200125_LoL_champion_data.csv?raw';
import '../styles/custom.css';

// Importación de componentes y registro de Chart.js
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const InformesPage = () => {
  // Estados para el CSV y filtros
  const [data, setData] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [heroType, setHeroType] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState('');

  // Estado para los datos de lanes (para gráficos) basado en lo filtrado
  const [laneData, setLaneData] = useState({});
  // Estado para el control de pestañas: 'bar' o 'pie'
  const [activeTab, setActiveTab] = useState('bar');

  // Definición de colores para la interfaz de pestañas
  const colores = {
    texto: '#ffffff',
    primario: '#007bff',
    secundario: '#0056b3'
  };

  // 1. Carga y parseo del CSV
  useEffect(() => {
    Papa.parse(csvData, {
      header: true,
      download: false,
      complete: (results) => {
        setData(results.data);
      },
      error: (error) => {
        console.error("Error al cargar el CSV:", error);
      }
    });
  }, []);

  // 2. Función para filtrar los datos según dificultad y tipo de héroe
  const handleFilter = (e) => {
    e.preventDefault();

    // Filtra según los campos "difficulty" y "herotype"
    const results = data.filter(champion =>
      // Si difficulty no está vacío, comparamos; si está vacío, dejamos pasar
      (difficulty ? champion.difficulty === difficulty : true) &&
      // Si heroType no está vacío, comparamos; si está vacío, dejamos pasar
      (heroType ? champion.herotype === heroType : true)
    );

    setMessage(results.length === 0 ? 'No hay resultados disponibles' : '');
    setFilteredData(results);

    // Recalcular laneData con el resultado filtrado
    const laneCount2 = {
      Top: results.filter(champion =>
        (champion.lanes || champion.client_positions)?.includes('Top')
      ).length,
      Middle: results.filter(champion =>
        (champion.lanes || champion.client_positions)?.includes('Middle')
      ).length,
      Bottom: results.filter(champion =>
        (champion.lanes || champion.client_positions)?.includes('Bottom')
      ).length,
      Jungle: results.filter(champion =>
        (champion.lanes || champion.client_positions)?.includes('Jungle')
      ).length,
    };
    setLaneData(laneCount2);
  };

  // 3. Función para generar el informe PDF con los datos filtrados
  const handleImprimir = (e) => {
    e.preventDefault();
    if (filteredData.length === 0) {
      setMessage('No hay datos para imprimir.');
      return;
    }

    const doc = new jsPDF({ orientation: "portrait" });

    // TÍTULO DEL DOCUMENTO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text('Campeones', 105, 15, { align: "center" });
    doc.setDrawColor(0);
    doc.line(10, 20, 200, 20);

    // ENCABEZADO
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Filtros Aplicados - Dificultad: ${difficulty || "Todas"}, Tipo: ${heroType || "Todos"}`,
      14,
      30
    );
    doc.text("Lista de campeones filtrados:", 14, 40);

    // TABLA
    const columns = ["Id", "Nombre", "Título", "Dificultad", "Tipo1", "Tipo2", "Lanes"];
    const rows = filteredData.map(champion => [
      champion.id,
      champion.apiname,
      champion.title,
      champion.difficulty,
      champion.herotype,
      champion.alttype,
      champion.client_positions
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 45,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'center'
      },
      headStyles: {
        fillColor: [41, 98, 255],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold"
      },
      alternateRowStyles: { fillColor: [230, 240, 255] },
      margin: { top: 50, left: 10, right: 10 },
    });

    // RESUMEN FINAL
    const totalHeroes = filteredData.length;
    const topLane = filteredData.filter(champ => champ.client_positions.includes("Top")).length;
    const midLane = filteredData.filter(champ => champ.client_positions.includes("Middle")).length;
    const botLane = filteredData.filter(champ => champ.client_positions.includes("Bottom")).length;
    const jungle = filteredData.filter(champ => champ.client_positions.includes("Jungle")).length;

    doc.setFontSize(12);
    doc.text(`Total de héroes: ${totalHeroes}`, 105, doc.autoTable.previous.finalY + 10, { align: "center" });
    doc.setFontSize(10);
    doc.text(
      `Estos son los héroes de tipo ${heroType} con dificultad ${difficulty},`,
      105,
      doc.autoTable.previous.finalY + 20,
      { align: "center" }
    );
    doc.text(
      `tenemos ${totalHeroes} héroes con esas características.`,
      105,
      doc.autoTable.previous.finalY + 25,
      { align: "center" }
    );
    doc.text(
      `${topLane} son top lane, ${midLane} son mid lane, ${botLane} son bot lane y ${jungle} son jungle.`,
      105,
      doc.autoTable.previous.finalY + 30,
      { align: "center" }
    );

    // NÚMERO DE PÁGINA
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${totalPages}`, 200, doc.internal.pageSize.height - 10, {
        align: "right"
      });
    }

    doc.save('informe.pdf');
  };

  // --- Componentes de las gráficas (BarChart y PieChart) ---
  const BarChart = ({ data }) => {
    const chartData = {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Número de héroes',
          data: Object.values(data),
          backgroundColor: 'rgba(178, 111, 184, 0.6)',
          borderColor: 'rgba(178, 111, 184, 1)',
          borderWidth: 1,
        },
      ],
    };
    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: false,
          text: 'Distribución de héroes por carril',
        },
      },
    };
    return <Bar data={chartData} options={options} />;
  };

  const PieChart = ({ data }) => {
    const chartData = {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: [
            'rgba(249, 132, 158, 0.6)',
            'rgba(160, 106, 214, 0.6)',
            'rgba(118, 125, 209, 0.6)',
            'rgba(103, 197, 142, 0.6)',
          ],
          borderColor: [
            'rgba(249, 132, 158, 1)',
            'rgba(160, 106, 214, 1)',
            'rgba(118, 125, 209, 1)',
            'rgba(103, 197, 142, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: false,
          text: 'Distribución de héroes por carril',
        },
      },
    };
    return <Pie data={chartData} options={options} />;
  };

  return (
    <div className="informes-container">
      <h2>Informes de Campeones</h2>

      {/* FORMULARIO DE FILTRO */}
      <form className="informes-form">
        <div className="input-group">
          <label htmlFor="difficulty">Dificultad:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Todas</option>
            {["1", "2", "3"].map((diff, index) => (
              <option key={index} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="heroType">Tipo de Héroe:</label>
          <select
            id="heroType"
            value={heroType}
            onChange={(e) => setHeroType(e.target.value)}
          >
            <option value="">Todos</option>
            {["Fighter", "Mage", "Assassin", "Tank", "Marksman", "Support"].map(
              (type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn filter-btn"
            onClick={handleFilter}
          >
            Filtrar
          </button>
          <button
            type="button"
            className="btn print-btn"
            onClick={handleImprimir}
          >
            Generar Informe
          </button>
        </div>
      </form>

      {message && <p className="error-message">{message}</p>}

      {/* LISTA DE CAMPEONES FILTRADOS */}
      {filteredData.length > 0 && (
        <div className="filtered-results">
          <h3>Campeones Filtrados:</h3>
          <ul>
            {filteredData.map((champion, index) => (
              <li key={index}>
                {champion.apiname ? champion.apiname : `Campeón ${index + 1}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECCIÓN DE GRÁFICOS CON PESTAÑAS (BARRAS / CIRCULAR) */}
      <div className="row mt-5">
        <div className="col-12">
          <ul
            className="nav nav-tabs"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'bar' ? 'active' : ''}`}
                onClick={() => setActiveTab('bar')}
                style={{
                  color: colores.texto,
                  backgroundColor: activeTab === 'bar' ? colores.secundario : colores.primario,
                  cursor: 'pointer',
                }}
                href="#"
              >
                Gráfico de Barras
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'pie' ? 'active' : ''}`}
                onClick={() => setActiveTab('pie')}
                style={{
                  color: colores.texto,
                  backgroundColor: activeTab === 'pie' ? colores.secundario : colores.primario,
                  cursor: 'pointer',
                }}
                href="#"
              >
                Gráfico Circular
              </a>
            </li>
          </ul>
          <div className="tab-content mt-3">
            <div
              style={{
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {activeTab === 'bar' && <BarChart data={laneData} />}
              {activeTab === 'pie' && <PieChart data={laneData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformesPage;

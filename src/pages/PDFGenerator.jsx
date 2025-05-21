import { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PDFGenerator() {
  const [recettes, setRecettes] = useState([]);
  const [selection, setSelection] = useState([]);
  const [dateAffichee, setDateAffichee] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const printRef = useRef();

  useEffect(() => {
    chargerRecettes();
  }, []);

  const chargerRecettes = async () => {
    const res = await axios.get("http://localhost:3001/recettes");
    setRecettes(res.data);
  };

  const toggleSelection = (id) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const recettesChoisies = recettes.filter((r) =>
    selection.includes(r.id)
  );

  const formatDateEuro = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return d.toLocaleDateString("fr-FR"); // JJ/MM/AAAA
  };

  const generatePDF = async () => {
    // petit délai pour que le DOM soit bien rendu
    await new Promise((r) => setTimeout(r, 100));

    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("recettes.pdf");
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h1 className="text-2xl font-bold mb-4">Génération PDF</h1>

      {/* Sélection de la date */}
      <div className="mb-4">
        <label className="font-medium">
          Date à afficher :
          <input
            type="date"
            value={dateAffichee}
            onChange={(e) => setDateAffichee(e.target.value)}
            className="ml-2 p-2 border rounded"
          />
        </label>
      </div>

      {/* Liste à cocher des recettes */}
      <ul className="space-y-2 mb-4">
        {recettes.map((recette) => (
          <li key={recette.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selection.includes(recette.id)}
              onChange={() => toggleSelection(recette.id)}
            />
            <label>{recette.nom}</label>
          </li>
        ))}
      </ul>

      <button
        onClick={generatePDF}
        className="bg-purple-600 text-white px-4 py-2 rounded mb-6"
      >
        Générer PDF
      </button>

      {/* Aperçu du PDF */}
      <div
        ref={printRef}
        className="bg-white p-4 text-black"
        style={{ color: "#000", backgroundColor: "#fff" }}
      >
        {/* Date choisie au format européen */}
        <p className="text-sm font-medium mb-4">
          Date : {formatDateEuro(dateAffichee)}
        </p>

        {recettesChoisies.map((recette) => (
          <div key={recette.id} className="mb-6 border-b pb-4">
            <h2 className="text-lg font-bold">{recette.nom}</h2>
            <ul className="text-sm text-black mt-1 list-disc list-inside">
              {recette.ingrédients.map((ri) => (
                <li key={ri.id}>
                  {ri.ingredient.nom} – {ri.ingredient.fournisseur} – DLC :{" "}
                  {formatDateEuro(ri.ingredient.dlc)} – Lot :{" "}
                  {ri.ingredient.lot}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

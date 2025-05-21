import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

export default function Recettes() {
  const [nom, setNom] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recettes, setRecettes] = useState([]);
  const [recetteEnEdition, setRecetteEnEdition] = useState(null);
  const [search, setSearch] = useState("");

  const API = "http://localhost:3001";

  useEffect(() => {
    chargerIngredients();
    chargerRecettes();
  }, []);

  const chargerIngredients = async () => {
    const res = await axios.get(`${API}/ingredients`);
    setIngredients(res.data);
  };

  const chargerRecettes = async () => {
    const res = await axios.get(`${API}/recettes`);
    setRecettes(res.data);
  };

  const options = ingredients.map((ing) => ({
    value: ing.id,
    label: `${ing.nom} (${ing.fournisseur})`
  }));

  const creerOuModifier = async () => {
    const ids = selectedIngredients.map((ing) => ing.value);
    if (recetteEnEdition) {
      // Modifier
      await axios.put(`${API}/recettes/${recetteEnEdition.id}`, {
        nom,
        ingredients: ids
      });
    } else {
      // Créer
      await axios.post(`${API}/recettes`, {
        nom,
        ingredients: ids
      });
    }

    setNom("");
    setSelectedIngredients([]);
    setRecetteEnEdition(null);
    chargerRecettes();
  };

  const modifierRecette = (recette) => {
    setRecetteEnEdition(recette);
    setNom(recette.nom);
    const ing = recette.ingrédients.map((ri) => ({
      value: ri.ingredient.id,
      label: `${ri.ingredient.nom} (${ri.ingredient.fournisseur})`
    }));
    setSelectedIngredients(ing);
  };

  const supprimerRecette = async (id) => {
    await axios.delete(`${API}/recettes/${id}`);
    if (recetteEnEdition?.id === id) {
      setNom("");
      setSelectedIngredients([]);
      setRecetteEnEdition(null);
    }
    chargerRecettes();
  };

  const recettesFiltrées = recettes.filter((r) =>
    r.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h1 className="text-2xl font-bold mb-4">
        {recetteEnEdition ? "Modifier une Recette" : "Créer une Recette"}
      </h1>

      <input
        type="text"
        placeholder="Nom de la recette"
        className="mb-4 p-2 border rounded w-full"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />

      <div className="mb-4">
        <Select
          options={options}
          isMulti
          value={selectedIngredients}
          onChange={setSelectedIngredients}
          placeholder="Sélectionner des ingrédients..."
        />
      </div>

      <button
        onClick={creerOuModifier}
        className={`${
          recetteEnEdition ? "bg-blue-600" : "bg-green-600"
        } text-white px-4 py-2 rounded mb-6`}
      >
        {recetteEnEdition ? "Enregistrer les modifications" : "Créer la recette"}
      </button>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une recette..."
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2 className="text-xl font-semibold mb-2">Recettes existantes</h2>
      <ul className="space-y-4">
        {recettesFiltrées.map((recette) => (
          <li key={recette.id} className="border p-4 rounded bg-gray-50">
            <div className="flex justify-between items-center">
              <strong>{recette.nom}</strong>
              <div className="space-x-2">
                <button
                  onClick={() => modifierRecette(recette)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => supprimerRecette(recette.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </div>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              {recette.ingrédients.map((ri) => (
                <li key={ri.id}>
                  {ri.ingredient.nom} – {ri.ingredient.fournisseur} – Lot: {ri.ingredient.lot}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

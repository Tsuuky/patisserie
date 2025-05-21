import { useEffect, useState } from "react";
import axios from "axios";

export default function Ingredient() {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    nom: "",
    fournisseur: "",
    dlc: "",
    lot: ""
  });
  const [ingredientEnEdition, setIngredientEnEdition] = useState(null);

  const API_URL = "http://localhost:3001/ingredients";

  // 🔁 Charger les ingrédients au montage
  useEffect(() => {
    chargerIngredients();
  }, []);

  const chargerIngredients = async () => {
    const res = await axios.get(API_URL);
    setIngredients(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ajouterOuModifierIngredient = async () => {
    if (ingredientEnEdition) {
      // 🔁 Modifier
      await axios.put(`${API_URL}/${ingredientEnEdition.id}`, form);
    } else {
      // ➕ Ajouter
      await axios.post(API_URL, form);
    }

    setForm({ nom: "", fournisseur: "", dlc: "", lot: "" });
    setIngredientEnEdition(null);
    chargerIngredients(); // 🔄 Recharger la liste
  };

  const supprimerIngredient = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    if (ingredientEnEdition?.id === id) {
      setIngredientEnEdition(null);
      setForm({ nom: "", fournisseur: "", dlc: "", lot: "" });
    }
    chargerIngredients();
  };

  const modifierIngredient = (ing) => {
    setIngredientEnEdition(ing);
    setForm({
      nom: ing.nom,
      fournisseur: ing.fournisseur,
      dlc: ing.dlc,
      lot: ing.lot
    });
  };

  const ingrédientsFiltrés = ingredients.filter((ing) =>
    ing.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h1 className="text-2xl font-bold mb-4">Gestion des Ingrédients</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un ingrédient..."
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Formulaire d'ajout / édition */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="fournisseur"
          placeholder="Fournisseur"
          value={form.fournisseur}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="dlc"
          value={form.dlc}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="lot"
          placeholder="Lot"
          value={form.lot}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>

      <button
        onClick={ajouterOuModifierIngredient}
        className={`${
          ingredientEnEdition ? "bg-blue-600" : "bg-green-600"
        } text-white px-4 py-2 rounded mb-6`}
      >
        {ingredientEnEdition ? "Enregistrer les modifications" : "Ajouter"}
      </button>

      {/* Liste des ingrédients */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nom</th>
            <th className="border p-2">Fournisseur</th>
            <th className="border p-2">DLC</th>
            <th className="border p-2">Lot</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingrédientsFiltrés.map((ing) => (
            <tr key={ing.id} className="hover:bg-gray-50">
              <td className="border p-2">{ing.nom}</td>
              <td className="border p-2">{ing.fournisseur}</td>
              <td className="border p-2">{ing.dlc}</td>
              <td className="border p-2">{ing.lot}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => modifierIngredient(ing)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => supprimerIngredient(ing.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

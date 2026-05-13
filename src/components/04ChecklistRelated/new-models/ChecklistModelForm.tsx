import { useState } from "react"
import { PlusLg, Trash3Fill, Dash } from "react-bootstrap-icons"
import type { ChecklistModelProps } from "../../../services/checklistModels.service"

export type ChecklistModelInput = Omit<
  ChecklistModelProps,
  "id" | "baseModelId" | "version" | "createdAt" | "createdBy"
>;

interface Props {
  initialData?: ChecklistModelProps
  loading?: boolean
  onSubmit: (data: ChecklistModelInput) => void
}

export default function ChecklistModelForm({ initialData, loading, onSubmit }: Props) {

  const [checklist, setChecklist] = useState<ChecklistModelInput>(() => {

    if (!initialData) {
      return {
        name: "",
        vertical: "",
        categories: [],
      }
    }

    return {
      ...initialData,

      categories: initialData.categories.map(category => ({
        ...category,

        // guarantee category id
        id: category.id || crypto.randomUUID(),

        // guarantee item ids
        items: category.items.map(item => ({
          ...item,
          id: item.id || crypto.randomUUID(),
        }))
      }))
    }
  })


  const [itemInputs, setItemInputs] = useState<Record<number, string>>({})
  const [newCategoryName, setNewCategoryName] = useState("")

  // ===== CATEGORY =====
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    setChecklist(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: crypto.randomUUID(),
          name: newCategoryName.trim(),
          items: []
        }
      ]
    }))

    setNewCategoryName("")
  }

  const handleRemoveCategory = (index: number) => {
    setChecklist(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }))
  }

  // ===== ITEM =====
  const handleAddItem = (catIndex: number) => {
    const value = itemInputs[catIndex]?.trim()
    if (!value) return

    setChecklist(prev => {
      const updated = structuredClone(prev.categories)

      updated[catIndex].items.push({
        id: crypto.randomUUID(),
        label: value,
        checked: false
      })

      return { ...prev, categories: updated }
    })

    setItemInputs(prev => ({ ...prev, [catIndex]: "" }))
  }

  const handleRemoveItem = (catIndex: number, itemId: string) => {
    setChecklist(prev => {
      const updated = structuredClone(prev.categories)

      updated[catIndex].items =
        updated[catIndex].items.filter(i => i.id !== itemId)

      return { ...prev, categories: updated }
    })
  }

  // ===== SUBMIT =====
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !checklist.name ||
      !checklist.vertical ||
      checklist.categories.length === 0 ||
      checklist.categories.some(cat => cat.items.length === 0)
    ) {
      alert("Preencha todos os campos, categorias e itens.")
      return
    }

    onSubmit(checklist)
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">

      {/* ===== NOME ===== */}
      <div className="form-floating">
        <input
          className="form-control"
          value={checklist.name}
          required
          onChange={(e) =>
            setChecklist(prev => ({ ...prev, name: e.target.value }))
          }
        />
        <label>Nome da checklist</label>
      </div>

      {/* ===== VERTICAL ===== */}
      <fieldset className="border rounded p-3">
        <legend className="fw-bold">Vertical</legend>

        <div className="d-flex gap-4">
          {["Preparo", "Plantio", "Pulverização"].map(v => (
            <label key={v} className="d-flex gap-2">
              <input
                type="radio"
                value={v}
                checked={checklist.vertical === v}
                onChange={(e) =>
                  setChecklist(prev => ({
                    ...prev,
                    vertical: e.target.value
                  }))
                }
              />
              {v}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ===== NOVA CATEGORIA ===== */}
      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Nova categoria..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />

        <button
          type="button"
          onClick={handleAddCategory}
          className="btn-custom btn-custom-outline-success"
        >
          <PlusLg />
        </button>
      </div>

      {/* ===== LISTA ===== */}
      <div className="d-flex flex-column gap-4">

        {checklist.categories.map((cat, catIndex) => (
          <div key={cat.id} className="border rounded p-3">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center">
              <h5>{cat.name}</h5>

              <button
                type="button"
                onClick={() => handleRemoveCategory(catIndex)}
                className="btn-custom btn-custom-primary"
              >
                <Trash3Fill />
              </button>
            </div>

            {/* ITEMS */}
            {cat.items.map((item, index) => (
              <div key={item.id ?? `${catIndex}-${index}`} className="d-flex justify-content-between align-items-center ps-3 py-1">

                <div className="d-flex gap-2">
                  <span>{item.label}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(catIndex, item.id!)}
                  className="btn-custom btn-custom-outline-primary"
                >
                  <Dash />
                </button>
              </div>
            ))}

            {/* ADD ITEM */}
            <div className="d-flex gap-2 mt-2">
              <input
                className="form-control"
                placeholder="Novo item..."
                value={itemInputs[catIndex] || ""}
                onChange={(e) =>
                  setItemInputs(prev => ({
                    ...prev,
                    [catIndex]: e.target.value
                  }))
                }
              />

              <button
                type="button"
                onClick={() => handleAddItem(catIndex)}
                className="btn-custom btn-custom-outline-success"
              >
                <PlusLg />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ===== SUBMIT ===== */}
      <div className="d-flex justify-content-end">
        <button
          className="btn-custom btn-custom-success px-4"
          type="submit"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>

    </form>
  )
}
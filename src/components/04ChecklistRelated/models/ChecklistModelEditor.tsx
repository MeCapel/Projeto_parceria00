// ===== GERAL IMPORTS =====
import { useState } from "react"
import type { CategoriesProps, CheckboxItemProps, ChecklistProps } from "../../../services/checklistServices"
import { Dash, PlusLg, Trash3Fill } from "react-bootstrap-icons"

// ===== TYPE INTERFACE =====
interface Props {
  checklist: ChecklistProps
  loading?: boolean
  onSave: (checklist: ChecklistProps) => void
  onCancel: () => void
}

// ===== MAIN COMPONENT =====
// ----- This component is responsable for calling the edit function from db, it requests checklist model edit function ----- 
export default function ChecklistModelEditor({
  checklist,
  loading,
  onSave,
  onCancel
}: Props) {

  const [localChecklist, setLocalChecklist] = useState<ChecklistProps>(
    structuredClone(checklist)
  )

  const [itemInputs, setItemInputs] = useState<Record<number, string>>({})
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleNewCategory = () => {

    if (!newCategoryName.trim()) return

    const newCategory: CategoriesProps = {
      name: newCategoryName.trim(),
      items: []
    }

    setLocalChecklist(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }))

    setNewCategoryName("")
  }

  const handleNewItem = (catIndex: number) => {

    const itemName = itemInputs[catIndex]?.trim()

    if (!itemName) return

    const newItem: CheckboxItemProps = {
      id: crypto.randomUUID(),
      label: itemName,
      checked: false
    }

    setLocalChecklist(prev => {

      const updated = structuredClone(prev.categories)

      updated[catIndex].items.push(newItem)

      return { ...prev, categories: updated }

    })

    setItemInputs(prev => ({
      ...prev,
      [catIndex]: ""
    }))
  }

  const handleDropItem = (catIndex: number, itemId: string) => {

    setLocalChecklist(prev => {

      const updated = structuredClone(prev.categories)

      updated[catIndex].items =
        updated[catIndex].items.filter(i => i.id !== itemId)

      return { ...prev, categories: updated }

    })
  }

  const handleDropCategory = (catIndex: number) => {

    setLocalChecklist(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== catIndex)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault()

    if (
      !localChecklist.name ||
      !localChecklist.vertical ||
      localChecklist.categories.length === 0 ||
      localChecklist.categories.some(c => c.items.length === 0)
    ) {

      alert("Preencha todas as categorias e itens.")
      return

    }

    onSave(localChecklist)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column gap-4 px-4"
    >

      <div>
        <p className="text-custom-red mb-0">Editar</p>
        <h2 className="fw-bold">{localChecklist.name}</h2>
      </div>

      {/* Nome */}

      <div className="form-floating mb-0">

        <input
          type="text"
          id="checklistName"
          className="form-control"
          required
          value={localChecklist.name}
          onChange={(e) =>
            setLocalChecklist(prev => ({
              ...prev,
              name: e.target.value
            }))
          }
        />

        <label htmlFor="checklistName">
          Nome da checklist
        </label>

      </div>

      {/* Vertical */}

      <fieldset className="col d-flex flex-column mt-3 align-items-start border rounded-2">

        <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 border bg-custom-gray00"
            style={{ top: "-25px", position: "relative" }}>
            <legend className='mb-0 text-white fs-5'>Vertical</legend>
        </div>

        <div className="d-flex w-100 gap-5 align-items-start justify-content-center" style={{ position: "relative", top: "-1rem"}} >

          {["Preparo", "Plantio", "Pulverização"].map(v => (

            <label key={v} className="d-flex gap-2 form-check-label">

              <input
                type="radio"
                name="vertical"
                value={v}
                className="form-check-input"
                checked={localChecklist.vertical === v}
                onChange={(e) =>
                  setLocalChecklist(prev => ({
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

      {/* Nova categoria */}

      <h3 className="text-center fw-bold text-custom-black mt-2">Adicionar categoria</h3>

      <div className="d-flex gap-3">

        <div className="form-floating mb-3 w-100">
                <input
                    type="text"
                    id="categoryName"
                    value={newCategoryName}
                    className="form-control"
                    placeholder="Nome da categoria..."
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
            <label htmlFor="categoryName" className="d-flex flex-column gap-3">Nome da nova categoria</label>
        </div>

        <button 
            style={{ height: "3.5rem" }}
            type="button" onClick={handleNewCategory}
            className="btn-custom btn-custom-outline-success d-flex align-items-center justify-content-center" 
        >
            <PlusLg size={18}/>
        </button>

      </div>

      {/* Lista categorias */}

      <div className="d-flex flex-column gap-4 mt-4 scroll-area">

        {localChecklist.categories.map((cat, catIndex) => (

          <div
            key={catIndex}
            className="border rounded p-3 mb-3"
          >

            <h5 className="d-flex justify-content-between">

              {cat.name}

              <button
                  type="button"
                  className="btn-custom btn-custom-primary d-flex align-items-center justify-content-center"
                  onClick={() => handleDropCategory(catIndex)}
              >
                  <Trash3Fill size={18}/>
              </button>

            </h5>

            {cat.items.map(item => (

              <div
                key={item.id}
                className="d-flex align-items-center justify-content-between gap-2 py-1 ps-3"
              >

                <div className="d-flex gap-3">
                      <input type="checkbox" checked={item.checked} readOnly />
                      <span>{item.label}</span>
                  </div>
                  <button
                      type="button"
                      onClick={() => handleDropItem(catIndex, item.id)}
                      className="py-2 btn-custom btn-custom-outline-primary d-flex align-items-center justify-content-center"
                  >
                      <Dash size={18}/>
                  </button>

              </div>

            ))}

            <div className="d-flex gap-2 mt-2">

              <input
                type="text"
                className="form-control"
                placeholder="Novo item"
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
                  onClick={() => handleNewItem(catIndex)}
                  className="btn-custom btn-custom-outline-success d-flex align-items-center justify-content-center"
              >
                  <PlusLg size={18}/>
              </button>

            </div>

          </div>

        ))}

      </div>

      <div className="d-flex justify-content-between">

        <button
          type="button"
          className="btn-custom btn-custom-outline-primary rounded-pill"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          className="btn-custom btn-custom-success rounded-pill"
          type="submit"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>

      </div>

    </form>
  )
}
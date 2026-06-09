import { useState } from "react"
import { PlusLg, Trash3Fill, Dash } from "react-bootstrap-icons"
import type { ChecklistModelProps } from "../../../services/checklistModels.service"
import FormRadioGroup from "../../forms/FormRadioGroup";
import FormInput from "../../forms/FormInput";

export type ChecklistModelInput = Omit<
  ChecklistModelProps,
  "id" | "baseModelId" | "version" | "createdAt" | "createdBy" | "status"
>;

interface Props {
  initialData?: ChecklistModelProps
  loading?: boolean
  onSubmit: (data: ChecklistModelInput) => void
}

export default function ChecklistModelForm({ initialData, loading, onSubmit }: Props) {
  const verticalArray = [
    {label: "Preparo", value: "preparo"},
    {label: "Plantio", value: "plantio"},
    {label: "Pulverização", value: "pulverizacao"},
  ];

  const [checklist, setChecklist] = useState<ChecklistModelInput>(() => {

    if (!initialData) {
      return {
        name: "",
        vertical: "",
        verticalLabel: "",
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

     try 
     {
        if (
          !checklist.name ||
          !checklist.vertical ||
          checklist.categories.length === 0 ||
          checklist.categories.some(cat => cat.items.length === 0)
        ) {
          alert("Preencha todos os campos, categorias e itens.")
          return
        }

        console.log(checklist)

        onSubmit(checklist)

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">

      {/* ===== NOME ===== */}
      <div className="form-floating">
        <FormInput
            label="Nome"
            name="name"
            value={checklist.name}
            onChange={
              (e) => setChecklist(prev => ({ ...prev, name: e.target.value }))
            }
            required
            minLength={3}
        />
      </div>

      {/* ===== VERTICAL ===== */}

      <div className="col-12">
        <FormRadioGroup
          label="Vertical"
          name="vertical"
          value={checklist.vertical}
          options={verticalArray}
          onChange={(e) =>
            setChecklist(prev => ({
              ...prev,
              vertical: e.target.value
          }))}
        />
      </div>

      {/* <p>
        {checklist.vertical}
      </p> */}

      {/* ===== NOVA CATEGORIA ===== */}
      <div className="d-flex gap-2">
        <div className="form-floating w-100">
                <input 
                    name="newCategory"
                    value={newCategoryName}
                    placeholder="Nova categoria..."
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    minLength={3}
                    maxLength={55}
                    className="form-control"
                />

            <label>Nova categoria...</label>
        </div>

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
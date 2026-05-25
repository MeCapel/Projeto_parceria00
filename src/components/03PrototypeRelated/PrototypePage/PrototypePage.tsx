// ===== IMPORTS =====
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Modal } from "react-bootstrap";

import {
  ArrowLeftCircleFill,
  Floppy2Fill,
  Trash3Fill,
  TrashFill,
} from "react-bootstrap-icons";

import type { PrototypeProps } from "../../../services/prototypes.service";

import { usePrototypes } from "../../../hooks/usePrototypes";

import PrototypeGeralInfosTab from "./PrototypeGeralInfosTab";
import PrototypeChecklistsTab from "./PrototypeChecklistsTab";
import OccurrencesPage from "./OccurrencesPage";
import PrototypeKPIsPage from "./PrototypeKPIsPage";

// ===== COMPONENT =====
export default function PrototypePage() {

  // ===== HOOKS =====
  const navigate =
    useNavigate();

  const { prototypeid } =
    useParams();

  const {
    prototype,
    loading,

    getPrototype,

    updatePrototype,
    patchPrototype,

    deletePrototype,
  } = usePrototypes();

  // ===== STATES =====
  const [currentView, setCurrentView] =
    useState(0);

  const [openDeleteModal, setOpenDeleteModal] =
    useState(false);

  // ===== FETCH =====
  useEffect(() => {

    if (!prototypeid) return;

    getPrototype(prototypeid);

  }, [prototypeid]);

  // ===== MODAL =====
  const openModal = () =>
    setOpenDeleteModal(true);

  const closeModal = () =>
    setOpenDeleteModal(false);

  // ===== UPDATE LOCAL =====
  const handleChange = (
    updatedData: Partial<PrototypeProps>
  ) => {

    patchPrototype(updatedData);

  };

  // ===== SAVE =====
  const handleSave = async () => {

    if (!prototype) return;

    try
    {
      await updatePrototype({
        id: prototype.id,

        code:
          prototype.code,

        name:
          prototype.name,

        description:
          prototype.description,

        stage:
          prototype.stage
            ?.toLowerCase() || "",

        vertical:
          prototype.vertical
            ?.toLowerCase() || "",

        projectId:
          prototype.projectId,

        clientId:
          prototype.clientId || undefined,

        location:
          prototype.location,

        areaSize:
          prototype.areaSize
            ? Number(prototype.areaSize)
            : undefined,
      });
    }
    catch (err)
    {
      console.error(err);
    }
  };

  // ===== DELETE =====
  const handleDelete = async () => {

    if (!prototype) return;

    try
    {
      await deletePrototype(
        prototype.id
      );

      navigate(
        `/projects/${prototype.projectId}`
      );
    }
    catch (err)
    {
      console.error(err);
    }

  };

  // ===== LOADING =====
  if (
    loading ||
    !prototype
  )
  {
    return (
      <p>
        Carregando...
      </p>
    );
  }

  // ===== TABS =====
  const componentsMap = [

    {
      label: "Informações gerais",

      i: 0,

      component: (
        <PrototypeGeralInfosTab
          prototype={prototype}
          onChange={handleChange}
        />
      ),
    },

    {
      label: "Checklists",

      i: 1,

      component: (
        <PrototypeChecklistsTab
          prototypeId={prototype.id}
          vertical={prototype.vertical}
        />
      ),
    },

    {
      label: "Ocorrências",

      i: 2,

      component: (
        <OccurrencesPage
          prototypeId={prototype.id}
        />
      ),
    },

    {
      label: "KPI's",

      i: 3,

      component: (
        <PrototypeKPIsPage
          prototypeId={prototype.id}
        />
      ),
    },
  ];

  // ===== JSX =====
  return (
    <>
      {/* ===== HEADER BACK ===== */}
      <div className="ps-5 pt-5 pb-0 pe-0">

        <button
          className="btn-custom btn-custom-link d-flex gap-3 align-items-center border-0 bg-transparent p-0"

          onClick={() =>
            navigate(
              `/projects/${prototype.projectId}`
            )
          }
        >

          <ArrowLeftCircleFill
            size={30}
            className="text-custom-black"
          />

          <p className="text-custom-black fs-5 mb-0 fw-semibold">
            voltar ao projeto
          </p>

        </button>

      </div>

      {/* ===== MAIN ===== */}
      <div className="py-3 px-5">

        {/* ===== HEADER ===== */}
        <header className="d-flex align-items-center justify-content-between mb-4">

          <div>

            <p className="fs-6 text-custom-red mb-0 fw-bold">
              Protótipo
            </p>

            <h1 className="text-custom-black fw-bold mb-0">
              {prototype.name}
            </h1>

          </div>

          <div className="d-flex gap-3">

            <button
              onClick={openModal}

              className="btn-custom btn-custom-outline-primary px-4 d-flex gap-2 align-items-center fw-bold"
            >

              <TrashFill size={20} />

              Excluir

            </button>

            <button
              onClick={handleSave}

              className="btn-custom btn-custom-success px-4 d-flex gap-2 align-items-center fw-bold shadow-sm"
            >

              <Floppy2Fill size={20} />

              Salvar

            </button>

          </div>

        </header>

        {/* ===== TABS ===== */}
        <div className="d-flex flex-column align-items-start mb-4">

          <div className="d-flex gap-2">

            {componentsMap.map(c => (

              <button
                key={c.i}

                onClick={() =>
                  setCurrentView(c.i)
                }

                className={`btn-custom px-4 py-2 border-0 rounded-0 border-bottom ${
                  currentView === c.i
                    ? "border-danger text-danger fw-bold"
                    : "border-transparent text-muted"
                }`}

                style={{
                  transition: "all 0.3s",
                }}
              >

                {c.label}

              </button>

            ))}

          </div>

          <div
            className="w-100"

            style={{
              borderBottom:
                "1px solid var(--gray02)",

              marginTop: "-1px",
            }}
          />

        </div>

        {/* ===== CONTENT ===== */}
        {
          componentsMap.find(
            c => c.i === currentView
          )?.component
        }

        {/* ===== DELETE MODAL ===== */}
        <Modal
          show={openDeleteModal}

          onHide={closeModal}

          centered
        >

          <Modal.Body className="text-center p-5">

            <Trash3Fill
              size={50}
              className="text-danger mb-4"
            />

            <h4 className="fw-bold mb-3">
              Excluir protótipo?
            </h4>

            <p className="text-muted mb-5">
              Esta ação não pode ser desfeita.
            </p>

            <div className="d-flex gap-3 justify-content-center">

              <button
                className="btn-custom btn-custom-gray shadow border px-4 rounded-3"

                onClick={closeModal}
              >
                Cancelar
              </button>

              <button
                className="btn-custom btn-custom-outline-primary"

                onClick={handleDelete}
              >
                Excluir
              </button>

            </div>

          </Modal.Body>

        </Modal>

      </div>
    </>
  );
}
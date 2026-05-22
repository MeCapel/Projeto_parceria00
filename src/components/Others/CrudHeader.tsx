import { PlusLg } from "react-bootstrap-icons";
import type { ReactNode } from "react";

interface Props {
    title: string;
    subtitle?: string;
    onNew?: () => void;

    // ✅ NOVO
    actions?: ReactNode;
}

function normalizeTitle(title: string) {
    const normalizedTitle = title.toLocaleLowerCase();

    if (normalizedTitle.endsWith("s")) {
        return normalizedTitle.slice(0, -1);
    }

    return normalizedTitle;
}

export default function CrudHeader({
    title,
    subtitle,
    onNew,
    actions,
}: Props) {

    const normalizedTitle = normalizeTitle(title);

    return (

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">

            {/* LEFT */}
            <div>
                <p className="mb-0 text-custom-red fs-5">
                    {title}
                </p>

                {subtitle && (
                    <h1 className="mb-0 text-custom-black fw-bold">
                        {subtitle}
                    </h1>
                )}
            </div>

            {/* RIGHT */}
            <div className="d-flex align-items-center gap-3 flex-wrap">

                {actions}

                {onNew && (
                    <button
                        className="btn-custom btn-custom-outline-black d-flex gap-3 align-items-center"
                        onClick={onNew}
                    >
                        <PlusLg size={18} />

                        Novo {normalizedTitle}
                    </button>
                )}

            </div>

        </div>
    );
}
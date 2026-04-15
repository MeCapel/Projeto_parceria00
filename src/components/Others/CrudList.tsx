import { type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function CrudList({ children }: Props) {
    return (
        <div className="d-flex gap-4 flex-wrap">
            {children}
        </div>
    );
}
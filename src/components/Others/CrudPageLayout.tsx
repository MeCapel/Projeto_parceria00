import { type ReactNode } from "react";

interface Props {
    header: ReactNode;
    list: ReactNode;
    modal?: ReactNode;
}

export default function CrudPageLayout({ header, list, modal }: Props) {
    return (
        <div className='p-5 mx-3'>
            {header}
            {list}
            {modal}
        </div>
    );
}
// ===== GERAL IMPORTS =====
import React, { useState } from "react"
import { useNavigate } from "react-router"
import { inviteUser } from "../../services/auth.service";

// ===== MAIN COMPONENT =====
// ----- Componente responsável pelo formulário de registro dos usuários / criação de conta -----
export default function SignInForm()
{
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ role, setRole ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    const handleCreateAccount = async (e: React.FormEvent ) => {
        e.preventDefault();

        if (!email || !role || !username)
        {
            alert("Preencha os campos e email e senha!");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email))
        {
            alert("Poer favor, insira um email válido.");
            setLoading(false);
            return;
        }

        setLoading(true);

        try 
        {
            const data = {
                username: username.trim(),
                email: email.trim(),
                role: role,
            }

            await inviteUser(data);
            alert("User created successfully!");
            navigate("/home");
        }
        catch (error: unknown)
        {
            const err = error as { code?: string, message?: string };
            switch (err.code) {
                case "auth/email-already-in-use":
                    alert("Este email já está em uso.");
                    break;
                case "auth/invalid-email":
                    alert("O formato do email é inválido.");
                    break;
                default:
                    alert("Ocorreu um erro ao criar a conta: " + (err.message || "Erro desconhecido"));
            }
        }
        finally
        {
            setLoading(false)
        }
    }

    return(
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center flex-column"
            style={{ backgroundImage: "url(/fromBrand/background-pattern.png)"}}>
            <form className="container bg-light p-5 d-flex flex-column rounded-3 gap-4" style={{ maxWidth: '30rem' }} onSubmit={handleCreateAccount}>
                <div className="d-flex flex-column align-items-center justify-content-center gap-3">
                    <div className="d-flex align-items-center justify-content-center">
                        <img height={30} src="/fromBrand/baldan-principal.png" alt="Logotipo da marca" />
                    </div>
                    <p className="fs-2 mb-0 fw-semibold text-black text-center">Adicionar conta</p>
                </div>
                
                <div className="d-flex flex-column gap-3">
                    <label htmlFor="username" className="fs-5">Nome</label>
                    <input 
                        type="text" 
                        name="" 
                        id="username" 
                        className="border py-2 px-3 fs-5 rounded-2" 
                        placeholder="Seu nome"
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </div>

                <div className="d-flex flex-column gap-3">
                    <label htmlFor="email" className="fs-5">Email</label>
                    <input 
                        type="text" 
                        name="" 
                        id="email" 
                        placeholder="conta@gmail.com" 
                        className="border py-2 px-3 fs-5 rounded-2" 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                
                <FormRadioGroup
                    label="Pápel"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={["admin", "coordenador de validacao", "integrador", "po", "tecnico de campo"]}
                    required
                />

                <button className="btn-custom btn-custom-outline-black fs-5 mt-4" type="submit" disabled={loading}>
                    <p className='mb-0'>{loading ? "Criando..." : "Criar"}</p>
                </button>

            </form>
        </div>
    )
}

interface Props {
    label: string;
    name: string;
    value: string | number;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
}

function FormRadioGroup({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
    error
}: Props) {

    return (
        <fieldset className={`w-100 mt-4 p-3 border rounded-3 position-relative ${
                error ? "border-danger" : ""
            }`} >

            {/* Label flutuante */}
            <legend 
                className="w-auto py-1 px-3 text-white fs-6 position-absolute bg-custom-gray00 rounded-pill"
                style={{ top: "-1rem", left: "1rem" }}>
                {label}
            </legend>

            {/* Radios */}
            <div className="d-flex flex-column gap-3 justify-content-center align-items-start mt-3">

                {options.map((opt, index) => (
                    <label
                        key={opt}
                        className="d-flex align-items-center gap-2 px-3 py-2 border rounded-3 w-100 w-md-auto"
                        style={{ cursor: "pointer" }}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={opt}
                            checked={value === opt}
                            onChange={onChange}
                            className={`form-check-input ${error ? "is-invalid" : ""}`}
                            required={required && index === 0}
                        />

                        <span>{opt}</span>
                    </label>
                ))}

            </div>

            {/* Feedback Bootstrap */}
            <div className="invalid-feedback">
                {error || `Selecione uma opção`}
            </div>

        </fieldset>
    );
}
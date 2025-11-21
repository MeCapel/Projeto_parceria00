import React, { useState } from "react"
import { useNavigate } from "react-router"
import { createAccount } from "../../services/authService"

export default function SignInForm()
{
    const [ userName, setUserName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    const handleCreateAccount = async (e: React.FormEvent ) => {
        e.preventDefault();

        if (!email || !password || !userName)
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

        if (password.length < 6)
        {
            alert("A senha deve ter mais que 6 caracteres!");
            setLoading(false);
            return;
        }

        setLoading(true);

        try 
        {
            await createAccount(userName.trim(), email.trim(), password.trim());
            alert("User created successfully!");
            navigate("/home");
        }
        catch (error: any)
        {
            switch (error.code) {
                case "auth/email-already-in-use":
                    alert("Este email já está em uso.");
                    break;

                case "auth/invalid-email":
                    alert("Formato de email inválido.");
                    break;

                case "auth/weak-password":
                    alert("A senha deve ter pelo menos 6 caracteres.");
                    break;
            
                default:
                    alert("Erro ao criar usuário: " + error.message);
                    break;
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
                <div className="">
                        <p className="fs-2 mb-0 fw-bold text-custom-black text-center">Adicionar conta</p>
                        <p className="fs-5 mb-0 text-center text-link-custom" onClick={() => navigate("/login")}
                            style={{ cursor: 'pointer'}}>
                            Entrar na sua conta
                        </p>
                </div>
                
                <div className="d-flex flex-column gap-3">
                    <label htmlFor="usernameInput" className="fs-5">Nome</label>
                    <input type="text" name="" id="usernameInput" className="py-2 px-3 fs-5 rounded-2" 
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setUserName(e.target.value)} required/>
                </div>

                <div className="d-flex flex-column gap-3">
                    <label htmlFor="emailInput" className="fs-5">Email</label>
                    <input type="text" name="" id="emailInput" placeholder="conta@gmail.com" className="py-2 px-3 fs-5 rounded-2" 
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                

                <div className="d-flex flex-column gap-3">
                    <label htmlFor="passwordInput" className="fs-5">Senha</label>
                    <input type="password" name="" id="passwordInput" className="py-2 px-3 fs-5 rounded-2" required
                           style={{ border: '1px solid var(--gray00)'}} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <button className="btn-custom btn-custom-success fs-5 mt-4" type="submit" disabled={loading}>
                    <p className='mb-0 text-custom-white'>{loading ? "Criando..." : "Criar"}</p>
                </button>

            </form>
        </div>
    )
}
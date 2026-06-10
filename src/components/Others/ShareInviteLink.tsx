import { useState } from "react";
import { toast } from "react-toastify";
import { EnvelopeFill, ChatDotsFill, PeopleFill, Clipboard, ClipboardCheck } from "react-bootstrap-icons";

interface ShareInviteLinkProps {
  inviteLink: string;
  onClose: () => void;
  onInviteAnother: () => void;
}

export default function ShareInviteLink({ inviteLink, onClose, onInviteAnother }: ShareInviteLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Erro ao copiar link.");
    }
  };

  const shareChannels = [
    {
      label: "Email",
      icon: EnvelopeFill,
      url: `mailto:?subject=${encodeURIComponent("Convite para acessar o Parceria")}&body=${encodeURIComponent(
        "Olá!\n\nVocê foi convidado(a) para a plataforma Parceria.\n\nAcesse o link abaixo para definir sua senha:\n" +
        inviteLink +
        "\n\nAtenciosamente,\nEquipe Parceria"
      )}`,
      className: "btn-custom-outline-secondary",
    },
    {
      label: "WhatsApp",
      icon: ChatDotsFill,
      url: `https://wa.me/?text=${encodeURIComponent(
        "Olá! Você foi convidado(a) para o Parceria.\nAcesse para definir sua senha: " + inviteLink
      )}`,
      className: "btn-custom-outline-secondary",
    },
    {
      label: "Teams",
      icon: PeopleFill,
      url: `https://teams.microsoft.com/share?href=${encodeURIComponent(inviteLink)}&msgText=${encodeURIComponent(
        "Olá! Você foi convidado para o Parceria.\nAcesse: " + inviteLink
      )}`,
      className: "btn-custom-outline-secondary",
    },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Success feedback */}
      <div className="text-center">
        <ClipboardCheck size={48} className="text-custom-green mb-3" />
        <h4 className="fw-bold text-custom-black mb-1">Usuário convidado com sucesso!</h4>
        <p className="text-muted small mb-0">
          Compartilhe o link abaixo para que ele possa definir a senha.
        </p>
      </div>

      {/* Link field + copy */}
      <div>
        <label className="fw-semibold small text-custom-black mb-2">Link de acesso</label>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control rounded-3 bg-light text-secondary user-select-all"
            value={inviteLink}
            readOnly
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            type="button"
            className={`btn-custom d-flex align-items-center gap-2 px-3 ${copied ? "btn-custom-success" : "btn-custom-outline-secondary"}`}
            onClick={handleCopy}
            title="Copiar link"
          >
            {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div>
        <label className="fw-semibold small text-custom-black mb-2">Compartilhar</label>
        <div className="d-flex gap-3 flex-wrap">
          {shareChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.label}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-custom d-flex align-items-center gap-2 px-3 py-2 text-decoration-none ${channel.className}`}
              >
                <Icon size={18} />
                {channel.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex justify-content-end gap-3 mt-2">
        <button
          type="button"
          className="btn-custom btn-custom-outline-secondary px-4"
          onClick={onInviteAnother}
        >
          Convidar outro
        </button>
        <button
          type="button"
          className="btn-custom btn-custom-success px-4"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

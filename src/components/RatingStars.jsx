import { FaStar, FaRegStar } from "react-icons/fa";

export default function RatingStars({ nota, aoAvaliar }) {
  const notaAtual = nota || 0;

  return (
    <div className="estrelas" role="group" aria-label="Sua nota para a série">
      {[1, 2, 3, 4, 5].map((numero) => (
        <button
          key={numero}
          type="button"
          onClick={() => aoAvaliar(numero === notaAtual ? null : numero)}
          aria-label={`Dar nota ${numero}`}
        >
          {numero <= notaAtual ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  );
}

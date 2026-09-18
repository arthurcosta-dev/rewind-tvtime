function comZeroNaFrente(numero) {
  return numero < 10 ? `0${numero}` : `${numero}`;
}

export default function EpisodeItem({ episodio, numeroTemporada, assistido, aoMarcar }) {
  const codigo = `S${comZeroNaFrente(numeroTemporada)}E${comZeroNaFrente(episodio.episode_number)}`;

  return (
    <div className="episodio">
      <span className="episodio-codigo">{codigo}</span>
      <span className="episodio-nome">{episodio.name}</span>
      <input
        type="checkbox"
        className="episodio-checkbox"
        checked={assistido}
        onChange={(evento) => aoMarcar(episodio.episode_number, evento.target.checked)}
        aria-label={`Marcar ${codigo} como assistido`}
      />
    </div>
  );
}

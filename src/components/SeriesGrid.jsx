import SeriesCard from "./SeriesCard";

export default function SeriesGrid({ series, idsJaSalvos, aoAdicionar }) {
  return (
    <div className="grade-series">
      {series.map((serie) => (
        <SeriesCard
          key={serie.id}
          serie={serie}
          estaSalva={idsJaSalvos.includes(serie.id)}
          aoAdicionar={aoAdicionar}
        />
      ))}
    </div>
  );
}

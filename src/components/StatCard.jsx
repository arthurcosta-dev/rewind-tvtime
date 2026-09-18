export default function StatCard({ titulo, valor, icone }) {
  return (
    <div className="canhoto">
      <div className="canhoto-icone">{icone}</div>
      <div className="canhoto-valor">{valor}</div>
      <div className="canhoto-titulo">{titulo}</div>
    </div>
  );
}

function MoodsCard({ name }) {
  return (
    <article className="mood-card">
      <div className="mood-card__body">
        <h2 className="mood-card__name">{name}</h2>
      </div>
    </article>
  );
}

export default MoodsCard;
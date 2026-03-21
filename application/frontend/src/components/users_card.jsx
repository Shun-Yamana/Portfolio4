import React from 'react';

function UserCard({ name, onClick, isSelected }) {
  return (
    <article 
      className={`mood-card ${isSelected ? 'is-selected' : ''}`} 
      onClick={onClick}
    >
      <div className="mood-card__body">
        <h2 className="mood-card__name">{name}</h2>
      </div>
    </article>
  );
}

export default UserCard;
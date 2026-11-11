export default function Hero({ restaurantCount, openCount }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="eyebrow"><span className="eyebrow-dot" />SEU PRÓXIMO PRATO FAVORITO</span>
        <h1>Sabores incríveis,<br /><span>perto de você.</span></h1>
        <p>Descubra restaurantes especiais e encontre algo delicioso para hoje.</p>
        <div className="hero-stats">
          <div><strong>{restaurantCount}</strong><span>restaurantes</span></div><i />
          <div><strong>{openCount}</strong><span>abertos agora</span></div><i />
          <div><strong>4.7<span className="stat-star">★</span></strong><span>nota média</span></div>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="hero-circle circle-one" /><div className="hero-circle circle-two" />
        <div className="hero-food">🥙</div><span className="floating floating-one">🍅</span>
        <span className="floating floating-two">🌿</span><span className="floating floating-three">✨</span>
        <div className="hero-note"><span>✦</span> Feito com sabor</div>
      </div>
    </section>
  );
}

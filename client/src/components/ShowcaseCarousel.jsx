

const SHOWCASE_ITEMS = [
  {
    image: '/showcase/robot.png',
    label: 'Stylized Robot',
    tag: 'Character',
    color: 'from-primary-100 to-indigo-100',

  },
  {
    image: '/showcase/sword.png',
    label: 'Crystal Sword',
    tag: 'Game Asset',
    color: 'from-violet-100 to-cyan-100',
    borderColor: 'border-violet-200',
  },
  {
    image: '/showcase/dragon.png',
    label: 'Baby Dragon',
    tag: 'Character',
    color: 'from-emerald-100 to-teal-100',
    borderColor: 'border-emerald-200',
  },
  {
    image: '/showcase/helmet.png',
    label: 'Sci-Fi Helmet',
    tag: 'Product',
    color: 'from-cyan-100 to-blue-100',
    borderColor: 'border-cyan-200',
  },
];

export default function ShowcaseCarousel() {
  return (
    <div className="mb-10 animate-fade-in-up">

      <div className="flex items-center justify-center mb-8 px-4 w-full">
        <h3 className="text-2xl sm:text-3xl font-bold text-surface-950"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Featured Showcase
        </h3>
      </div>


      <div className="w-full pb-3 grid gap-6 grid-cols-2 lg:grid-cols-4">
        {SHOWCASE_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`
              rounded-2xl overflow-hidden shadow-lg
              bg-white
              border border-surface-200/60
              cursor-pointer flex flex-col
              group transition-all duration-500
              hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-surface-300
            `}
          >

            <div className={`relative h-[180px] sm:h-[220px] overflow-hidden bg-gradient-to-br ${item.color}`}>
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                               bg-white/90 backdrop-blur-md text-surface-900 shadow-sm border border-white/50">
                  {item.tag}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent z-10" />
            </div>


            <div className="px-5 py-4 bg-white relative z-20 flex-1 flex flex-col justify-center">
              <p className="text-base font-bold text-surface-950 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {item.label}
              </p>
              <p className="text-[11px] text-surface-500 font-medium mt-1 tracking-wide">HexEra Engine</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

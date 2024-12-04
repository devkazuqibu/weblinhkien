import CategoryItem from "../components/CategoryItem";

const categories = [
  { href: "/cpu", name: "CPU", imageUrl: "/CPU.png" },
  { href: "/Manhinh", name: "Màn hình", imageUrl: "/manhinhPC.jpeg" },
  { href: "/Nguon", name: "Nguồn", imageUrl: "/NguonPC.webp" },
  { href: "/Ocung", name: "Ổ Cứng", imageUrl: "/Ocung.webp" },
  { href: "/Ram", name: "Ram", imageUrl: "/Ram.webp" },
  { href: "/Tannhiet", name: "Tản Nhiệt", imageUrl: "/TanNhietPC.webp" },
  { href: "/CdDohoa", name: "Card Đồ Họa ", imageUrl: "/Carddohoa.webp" },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-white mb-4">
          Siêu sale tháng 12
        </h1>
        <p className="text-center text-xl text-white mb-12">
          Đại tiệc cuối năm săn sale xã láng
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
